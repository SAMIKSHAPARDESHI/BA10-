import re
import time
import json
import os
from datetime import datetime
import speech_recognition as sr
import pyttsx3

LANGUAGE = "en-IN"
SPEAK_PROMPTS = True

# -----------------------------
# TEXT TO SPEECH (Windows)
# -----------------------------
engine = pyttsx3.init()
engine.setProperty('rate', 150)

def speak(msg: str):
    print(msg)
    if SPEAK_PROMPTS:
        engine.say(msg)
        engine.runAndWait()

def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.lower().strip()) if s else ""

# -----------------------------
# AUTO MICROPHONE DETECTION
# -----------------------------
def get_mic_index():
    mics = sr.Microphone.list_microphone_names()
    for i, name in enumerate(mics):
        name_lower = name.lower()
        if "input" in name_lower or "hands-free" in name_lower:
            print(f"✅ Using mic: {name} (index {i})")
            return i

    print("⚠️ Using default mic (0)")
    return 0

# -----------------------------
# VOICE FORM CLASS
# -----------------------------
class VoiceForm:
    def __init__(self):
        self.r = sr.Recognizer()
        self.r.pause_threshold = 1.0
        self.r.energy_threshold = 200
        self.r.dynamic_energy_threshold = True

        print("Available microphones:")
        for i, mic in enumerate(sr.Microphone.list_microphone_names()):
            print(i, mic)

        self.mic_index = get_mic_index()
        print("🎤 Microphone ready...")

    def listen(self):
        try:
            with sr.Microphone(device_index=self.mic_index) as source:
                print("🎤 Listening...")
                time.sleep(0.5)

                self.r.adjust_for_ambient_noise(source, duration=0.5)

                audio = self.r.listen(
                    source,
                    timeout=15,
                    phrase_time_limit=10
                )

            text = self.r.recognize_google(audio, language=LANGUAGE).strip()
            print("Voice Input:", text)
            return text

        except Exception as e:
            print("❌ Recognition ERROR:", e)
            return None

    def ask(self, prompt, retries=3):
        for _ in range(retries):
            speak(prompt)
            speak("Speak in 3")
            time.sleep(0.5)
            speak("2")
            time.sleep(0.5)
            speak("1")
            time.sleep(2.5)

            text = self.listen()
            if text:
                return text

        return None

# -----------------------------
# PARSERS
# -----------------------------
def parse_name(text):
    t = re.sub(r"[^A-Za-z ]", " ", text or "")
    return t.strip().title() if t else None

def parse_age(text):
    m = re.search(r"\d{1,3}", text or "")
    if not m:
        return None
    age = int(m.group())
    return age if 1 <= age <= 120 else None

def parse_dob(text):
    t = norm(text)

    m = re.search(r"\b([0-3]?\d)[/\-.\s]+([0-1]?\d)[/\-.\s]+((?:19|20)\d{2})\b", t)
    if m:
        d, mo, y = map(int, m.groups())
        try:
            return datetime(y, mo, d).strftime("%d/%m/%Y")
        except:
            return None

    return None

# -----------------------------
# ASK FIELD
# -----------------------------
def ask_field(vf, prompt, parser):
    attempts = 0
    while attempts < 3:
        attempts += 1

        txt = vf.ask(prompt)
        if not txt:
            continue

        if "quit" in norm(txt):
            return "__QUIT__"

        value = parser(txt)
        if value:
            return value

        speak("Didn't understand, try again.")

    return None

# -----------------------------
# REVIEW & EDIT
# -----------------------------
def review_and_edit(data: dict) -> dict:
    """Show captured data and allow the user to edit any field."""
    fields = [
        ("first_name", "First Name"),
        ("last_name",  "Last Name"),
        ("dob",        "Date of Birth (DD/MM/YYYY)"),
        ("age",        "Age"),
    ]

    while True:
        print("\n" + "=" * 40)
        print("        REVIEW YOUR DETAILS")
        print("=" * 40)
        for i, (key, label) in enumerate(fields, 1):
            print(f"  {i}. {label:<28}: {data[key]}")
        print("=" * 40)
        print("  Enter field number to edit (1-4)")
        print("  Press ENTER to confirm & download")
        print("=" * 40)

        choice = input("Your choice: ").strip()

        if choice == "":
            # confirmed — proceed to download
            break

        if choice in ("1", "2", "3", "4"):
            idx = int(choice) - 1
            key, label = fields[idx]
            new_val = input(f"  New value for {label}: ").strip()
            if new_val:
                data[key] = new_val
                print(f"  ✅ {label} updated.")
        else:
            print("  Invalid choice. Enter 1-4 or press ENTER.")

    return data

# -----------------------------
# DOWNLOAD / SAVE
# -----------------------------
def save_form(data: dict):
    """Save form data as both JSON and TXT in the current directory."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base = f"form_{data['last_name'].replace(' ', '_')}_{timestamp}"

    # --- JSON ---
    json_path = base + ".json"
    payload = {**data, "captured_at": datetime.now().isoformat()}
    with open(json_path, "w") as f:
        json.dump(payload, f, indent=2)
    print(f"\n✅ JSON saved → {os.path.abspath(json_path)}")

    # --- TXT ---
    txt_path = base + ".txt"
    with open(txt_path, "w") as f:
        f.write("VOICE FORM DATA\n")
        f.write("=" * 30 + "\n")
        f.write(f"First Name : {data['first_name']}\n")
        f.write(f"Last Name  : {data['last_name']}\n")
        f.write(f"DOB        : {data['dob']}\n")
        f.write(f"Age        : {data['age']}\n")
        f.write(f"Captured   : {datetime.now().isoformat()}\n")
    print(f"✅ TXT  saved → {os.path.abspath(txt_path)}")

    speak("Form saved successfully")

# -----------------------------
# MAIN
# -----------------------------
def main():
    vf = VoiceForm()
    speak("Voice form started")

    first_name = ask_field(vf, "Say your first name", parse_name)
    if not first_name:
        speak("Failed to capture first name")
        return

    last_name = ask_field(vf, "Say your last name", parse_name)
    if not last_name:
        speak("Failed to capture last name")
        return

    dob = ask_field(vf, "Say your date of birth like 12 slash 5 slash 2002", parse_dob)
    if not dob:
        speak("Failed to capture date of birth")
        return

    age = ask_field(vf, "Say your age", parse_age)
    if not age:
        speak("Failed to capture age")
        return

    # Collect into dict
    data = {
        "first_name": first_name,
        "last_name":  last_name,
        "dob":        dob,
        "age":        age,
    }

    # Review & optionally edit
    data = review_and_edit(data)

    # Save both formats
    save_form(data)

if __name__ == "__main__":
    main()
