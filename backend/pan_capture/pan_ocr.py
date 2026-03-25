





import pytesseract
from PIL import Image
import re

pytesseract.pytesseract.tesseract_cmd = \
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Load image
img = Image.open("captured_pan.jpg")

# OCR
text = pytesseract.image_to_string(img)

print("\n🔍 OCR RAW TEXT:\n")
print(text)

# ---------------------------
# PAN Extraction
# PAN format: 5 letters + 4 digits + 1 letter
# ---------------------------
pan_pattern = r"\b[A-Z]{5}[0-9]{4}[A-Z]\b"
pan_match = re.search(pan_pattern, text)

pan_number = pan_match.group() if pan_match else None

# ---------------------------
# DOB Extraction (DD/MM/YYYY)
# ---------------------------
dob_pattern = r"\b\d{2}/\d{2}/\d{4}\b"
dob_match = re.search(dob_pattern, text)

dob = dob_match.group() if dob_match else None

# ---------------------------
# PAN Validation Logic
# ---------------------------
valid_pan = pan_number is not None

# ---------------------------
# FINAL OUTPUT
# ---------------------------
print("\n📄 FINAL RESULT")
print("-------------------")
print(f"PAN Number : {pan_number}")
print(f"DOB        : {dob}")
print(f"Valid PAN  : {valid_pan}")