import re
import subprocess
import time
from datetime import datetime
import speech_recognition as sr

LANGUAGE = "en-IN"
SPEAK_PROMPTS = True

def speak(msg: str):
    print(msg)
    if SPEAK_PROMPTS:
        subprocess.run(["say", msg], check=False)

def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.lower().strip()) if s else ""

# -----------------------------
# NUMBER HELPERS (for spoken DOB)
# -----------------------------
ONES = {
    "zero": 0, "oh": 0, "o": 0, "one": 1, "two": 2, "three": 3, "four": 4,
    "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9
}
TEENS = {
    "ten": 10, "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14,
    "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18, "nineteen": 19
}
TENS = {
    "twenty": 20, "thirty": 30, "forty": 40, "fifty": 50,
    "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90
}
MONTHS = {
    "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
    "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12
}

def parse_small_number_words(words):
    if not words:
        return None
    total = 0
    i = 0
    while i < len(words):
        w = words[i]
        if w in TEENS:
            total += TEENS[w]
        elif w in TENS:
            total += TENS[w]
            if i + 1 < len(words) and words[i + 1] in ONES:
                total += ONES[words[i + 1]]
                i += 1
        elif w in ONES:
            total += ONES[w]
        else:
            return None
        i += 1
    return total

def parse_year_from_words(text):
    t = norm(text).replace("-", " ")
    words = [w for w in re.findall(r"[a-z]+", t) if w != "and"]

    m = re.search(r"\b(19\d{2}|20\d{2})\b", t)
    if m:
        return int(m.group(1))

    if words and words[0] in ("nineteen", "twenty"):
        century = 1900 if words[0] == "nineteen" else 2000
        rest = parse_small_number_words(words[1:]) if len(words) > 1 else 0
        if rest is not None and 0 <= rest <= 99:
            return century + rest

    if len(words) >= 2 and words[0] == "two" and words[1] == "thousand":
        rest = parse_small_number_words(words[2:]) if len(words) > 2 else 0
        if rest is not None and 0 <= rest <= 99:
            return 2000 + rest

    return None

class VoiceForm:
    def __init__(self):
        self.r = sr.Recognizer()
        self.r.pause_threshold = 1.0
        self.r.non_speaking_duration = 0.5
        self.r.phrase_threshold = 0.2
        self.mic = sr.Microphone()

        with self.mic as source:
            print("Calibrating microphone...")
            self.r.adjust_for_ambient_noise(source, duration=1.2)

    def listen(self, timeout=8, phrase_time_limit=8):
        with self.mic as source:
            audio = self.r.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
        text = self.r.recognize_google(audio, language=LANGUAGE).strip()
        print("Voice Input:", text)
        return text

    def ask(self, prompt, retries=3, timeout=8, phrase_time_limit=8):
        for _ in range(retries):
            try:
                speak(prompt)
                speak("Please say in 3")
                time.sleep(0.5)
                speak("2")
                time.sleep(0.5)
                speak("1")
                time.sleep(0.2)
                time.sleep(0.15)
                return self.listen(timeout=timeout, phrase_time_limit=phrase_time_limit)
            except Exception:
                pass
        return None

def parse_name(text):
    t = re.sub(r"[^A-Za-z ]", " ", text or "")
    t = re.sub(r"\s+", " ", t).strip()
    return t.title() if t else None

def parse_age(text):
    m = re.search(r"\d{1,3}", text or "")
    if not m:
        return None
    age = int(m.group())
    return age if 1 <= age <= 120 else None

def parse_dob(text):
    t = norm(text).replace("oh", "0").replace("-", " ")

    # 1) dd/mm/yyyy, d/m/yyyy, dd-mm-yyyy, dd mm yyyy, dd.mm.yyyy
    m = re.search(r"\b([0-3]?\d)[/\-.\s]+([0-1]?\d)[/\-.\s]+((?:19|20)\d{2})\b", t)
    if m:
        d, mo, y = map(int, m.groups())
        try:
            return datetime(y, mo, d).strftime("%d/%m/%Y")
        except ValueError:
            return None

    # 2) dd month yyyy
    m2 = re.search(r"\b([0-3]?\d)\s+([a-z]+)\s+(.+)$", t)
    if m2:
        d = int(m2.group(1))
        mo_word = m2.group(2)
        year_part = m2.group(3)
        mo = MONTHS.get(mo_word)
        y = parse_year_from_words(year_part)
        if mo and y:
            try:
                return datetime(y, mo, d).strftime("%d/%m/%Y")
            except ValueError:
                return None

    # 3) compact digits from ASR join: 6/7/8 digits
    digits = re.sub(r"\D", "", t)
    if len(digits) in (6, 7, 8):
        y = int(digits[-4:])
        dm = digits[:-4]

        candidates = []
        if len(dm) == 2:
            candidates.append((int(dm[0]), int(dm[1])))          # d m
        elif len(dm) == 3:
            candidates.append((int(dm[0]), int(dm[1:])))         # d mm
            candidates.append((int(dm[:2]), int(dm[2])))         # dd m
        elif len(dm) == 4:
            candidates.append((int(dm[:2]), int(dm[2:])))        # dd mm

        for d, mo in candidates:
            try:
                return datetime(y, mo, d).strftime("%d/%m/%Y")
            except ValueError:
                pass

    # 4) spoken style: "16 11 nineteen seventy eight"
    m3 = re.search(r"\b([0-3]?\d)\s+([0-1]?\d)\s+(.+)$", t)
    if m3:
        d = int(m3.group(1))
        mo = int(m3.group(2))
        y = parse_year_from_words(m3.group(3))
        if y:
            try:
                return datetime(y, mo, d).strftime("%d/%m/%Y")
            except ValueError:
                return None

    return None

DIGIT_WORDS = {
    "zero": "0", "oh": "0", "o": "0",
    "one": "1", "won": "1",
    "two": "2", "to": "2", "too": "2",
    "three": "3", "four": "4", "for": "4",
    "five": "5", "six": "6", "seven": "7",
    "eight": "8", "ate": "8", "nine": "9",
}

def digits_from_text(text):
    t = norm(text)

    raw = re.sub(r"\D", "", t)
    if raw:
        return raw

    out = []
    tokens = t.split()
    i = 0
    while i < len(tokens):
        tok = tokens[i]

        if tok in ("double", "triple") and i + 1 < len(tokens):
            n = 2 if tok == "double" else 3
            nxt = tokens[i + 1]
            if nxt in DIGIT_WORDS:
                out.extend([DIGIT_WORDS[nxt]] * n)
                i += 2
                continue

        if tok in DIGIT_WORDS:
            out.append(DIGIT_WORDS[tok])
        elif tok.isdigit():
            out.extend(list(tok))

        i += 1

    return "".join(out)

def get_phone(vf):
    speak("Please say your mobile number. You can speak in parts.")
    collected = ""
    no_progress_rounds = 0

    while len(collected) < 10:
        remaining = 10 - len(collected)

        if remaining == 1:
            prompt = "Please say only the last digit slowly now."
            timeout = 10
            phrase_time_limit = 4
        else:
            prompt = f"Say next digits. {remaining} digits remaining."
            timeout = 8
            phrase_time_limit = 7

        txt = vf.ask(prompt, retries=2, timeout=timeout, phrase_time_limit=phrase_time_limit)

        if not txt:
            no_progress_rounds += 1
        else:
            if "quit" in norm(txt):
                return "__QUIT__"

            part = digits_from_text(txt)
            if part:
                before = len(collected)
                collected = (collected + part)[:10]
                if len(collected) > before:
                    no_progress_rounds = 0
                    print("Captured phone digits:", collected)
                else:
                    no_progress_rounds += 1
            else:
                no_progress_rounds += 1

        if no_progress_rounds >= 2:
            speak("I am not catching it clearly. Please say full 10 digit mobile number now.")
            full_try = vf.ask("Say all 10 digits now.", retries=2, timeout=12, phrase_time_limit=10)
            if full_try:
                full_digits = digits_from_text(full_try)
                if len(full_digits) >= 10:
                    collected = full_digits[:10]
                    print("Captured phone digits:", collected)
                    break

            typed = input("Enter mobile number manually (10 digits): ").strip()
            typed_digits = re.sub(r"\D", "", typed)
            if len(typed_digits) == 10:
                return typed_digits
            return None

    if len(collected) == 12 and collected.startswith("91"):
        collected = collected[2:]
    if len(collected) == 11 and collected.startswith("0"):
        collected = collected[1:]

    return collected if len(collected) == 10 else None

def ask_field(vf, prompt, parser, timeout=8, phrase_time_limit=8):
    while True:
        txt = vf.ask(prompt, timeout=timeout, phrase_time_limit=phrase_time_limit)
        if not txt:
            continue
        if "quit" in norm(txt):
            return "__QUIT__"

        value = parser(txt)
        if value:
            return value
        speak("I could not understand. Please repeat clearly.")

def main():
    vf = VoiceForm()
    speak("Voice form started.")

    first_name = ask_field(vf, "Please say your first name.", parse_name)
    if first_name == "__QUIT__":
        return

    last_name = ask_field(vf, "Please say your last name.", parse_name)
    if last_name == "__QUIT__":
        return

    dob = ask_field(
        vf,
        "Please say your date of birth digit by digit, like one pause one pause two zero one zero.",
        parse_dob,
        timeout=10,
        phrase_time_limit=10,
    )
    if dob == "__QUIT__":
        return

    age = ask_field(vf, "Please say your age.", parse_age)
    if age == "__QUIT__":
        return

    phone = get_phone(vf)
    if phone == "__QUIT__":
        return
    if not phone:
        speak("Phone number capture failed.")
        return

    print("\nFORM DATA")
    print("---------")
    print(f"First Name : {first_name}")
    print(f"Last Name  : {last_name}")
    print(f"DOB        : {dob}")
    print(f"Age        : {age}")
    print(f"Phone      : {phone}")

if __name__ == "__main__":
    main()
