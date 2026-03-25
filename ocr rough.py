import cv2
import re
import pytesseract
from datetime import datetime

# -----------------------------------
# TESSERACT PATH (macOS - Homebrew)
# -----------------------------------
pytesseract.pytesseract.tesseract_cmd = "/opt/homebrew/bin/tesseract"

# -----------------------------------
# LOAD IMAGE
# -----------------------------------
IMAGE_PATH = "captured_pan.jpg"
img = cv2.imread(IMAGE_PATH)

if img is None:
    print(f"Image not found: {IMAGE_PATH}")
    raise SystemExit(1)

# -----------------------------------
# OCR HELPERS
# -----------------------------------
def preprocess_variants(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    variants = [gray]

    # OTSU threshold
    _, otsu = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    variants.append(otsu)

    # Adaptive threshold
    adap = cv2.adaptiveThreshold(
        cv2.GaussianBlur(gray, (5, 5), 0),
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        5,
    )
    variants.append(adap)

    # Inverted adaptive
    variants.append(255 - adap)
    return variants


def ocr_text(image, psm=6, whitelist=None):
    cfg = f"--oem 3 --psm {psm}"
    if whitelist:
        cfg += f" -c tessedit_char_whitelist={whitelist}"
    return pytesseract.image_to_string(image, config=cfg)


def collect_full_ocr_texts(image):
    texts = []
    for im in preprocess_variants(image):
        texts.append(ocr_text(im, psm=6))
        texts.append(ocr_text(im, psm=11))
        texts.append(ocr_text(im, psm=7))
    return texts


# -----------------------------------
# PAN EXTRACTION
# -----------------------------------
def extract_pan(text):
    t = text.upper()
    t = re.sub(r"[^A-Z0-9]", "", t)

    # direct PAN pattern
    m = re.search(r"[A-Z]{5}[0-9]{4}[A-Z]", t)
    if m:
        return m.group(0)

    return None


# -----------------------------------
# DOB EXTRACTION (ROBUST)
# -----------------------------------
def _normalize_dob_text(t):
    t = t.upper()
    replacements = {
        "O": "0",
        "Q": "0",
        "I": "1",
        "L": "1",
        "|": "1",
        "Z": "2",
        "S": "5",
        "B": "8",
    }
    for k, v in replacements.items():
        t = t.replace(k, v)
    return t


def _valid_date(d, m, y):
    current_year = datetime.now().year
    if y < 1900 or y > current_year:
        return False
    try:
        datetime(y, m, d)
        return True
    except ValueError:
        return False


def _parse_dob_from_text(text):
    t = _normalize_dob_text(text)

    # 1) dd/mm/yyyy, dd-mm-yyyy, dd mm yyyy, dd.mm.yyyy
    m = re.search(r"\b([0-3]?\d)[\/\-\.\s]+([0-1]?\d)[\/\-\.\s]+((?:19|20)\d{2})\b", t)
    if m:
        d, mm, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if _valid_date(d, mm, y):
            return f"{d:02d}/{mm:02d}/{y:04d}"

    # 2) compact format ddmmyyyy (also catches "1611 2003")
    digits = re.sub(r"\D", "", t)
    m2 = re.search(r"([0-3]\d)([0-1]\d)((?:19|20)\d{2})", digits)
    if m2:
        d, mm, y = int(m2.group(1)), int(m2.group(2)), int(m2.group(3))
        if _valid_date(d, mm, y):
            return f"{d:02d}/{mm:02d}/{y:04d}"

    return None


def extract_dob_robust(image, full_ocr_texts):
    h, w = image.shape[:2]

    # ROI guesses where DOB usually appears on PAN card
    rois = [
        image[int(h * 0.35):int(h * 0.85), 0:w],
        image[int(h * 0.45):int(h * 0.95), 0:w],
        image[int(h * 0.30):int(h * 0.75), int(w * 0.2):w],
    ]

    candidates = []

    # Pass 1: parse all full-image OCR outputs
    for txt in full_ocr_texts:
        dob = _parse_dob_from_text(txt)
        if dob:
            candidates.append(dob)

    # Pass 2: DOB-focused OCR on ROIs
    whitelist = "0123456789/-. DOBATEIRTH"
    for roi in rois:
        if roi.size == 0:
            continue

        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

        _, th = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        ad = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 5
        )

        for roi_variant in (gray, th, ad, 255 - ad):
            for psm in (6, 7, 11):
                txt = ocr_text(roi_variant, psm=psm, whitelist=whitelist)
                dob = _parse_dob_from_text(txt)
                if dob:
                    candidates.append(dob)

    if not candidates:
        return None

    # Majority vote
    return max(set(candidates), key=candidates.count)


# -----------------------------------
# RUN OCR + EXTRACT
# -----------------------------------
all_texts = collect_full_ocr_texts(img)

# Debug sample
print("\nOCR SAMPLE (first pass):\n")
print(all_texts[0][:1200])

pan_number = None
for txt in all_texts:
    pan = extract_pan(txt)
    if pan:
        pan_number = pan
        break

dob = extract_dob_robust(img, all_texts)

# -----------------------------------
# FINAL OUTPUT
# -----------------------------------
print("\nFINAL RESULT")
print("----------------------")
print(f"PAN Number : {pan_number}")
print(f"DOB        : {dob}")
print(f"Valid PAN  : {pan_number is not None}")

