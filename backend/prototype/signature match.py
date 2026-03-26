import cv2
import numpy as np
import os

# -----------------------------------
# PREPROCESS SIGNATURE IMAGE
# -----------------------------------
def load_and_prepare_signature(path):
    img = cv2.imread(path)

    if img is None:
        print(f" Could not load image: {path}")
        return None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Binarize (convert to black & white)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

    # Resize to standard size
    standardized = cv2.resize(thresh, (300, 150))

    return standardized


# -----------------------------------
# EXTRACT SIGNATURE FROM PAN CARD
# -----------------------------------
def extract_signature_from_pan(pan_image_path, output_path="pan_signature.jpg"):
    img = cv2.imread(pan_image_path)

    if img is None:
        print(" PAN image not found")
        return None

    h, w = img.shape[:2]

    # Approximate region where signature is located (bottom-right)
    signature_region = img[int(h * 0.65):h, int(w * 0.5):w]

    cv2.imwrite(output_path, signature_region)
    print(f" Extracted PAN signature → {output_path}")

    return output_path


# -----------------------------------
# COMPARE TWO SIGNATURES
# -----------------------------------
def calculate_difference(sig1, sig2):
    return np.mean(cv2.absdiff(sig1, sig2))


# -----------------------------------
# MAIN VERIFICATION FUNCTION
# -----------------------------------
def verify_signature(pan_image_path, user_signature_path, threshold=40):
    print("\n Signature Verification Started...\n")

    # Step 1: Extract PAN signature
    pan_sig_path = extract_signature_from_pan(pan_image_path)

    if pan_sig_path is None:
        return False

    # Step 2: Load both signatures
    pan_signature = load_and_prepare_signature(pan_sig_path)
    user_signature = load_and_prepare_signature(user_signature_path)

    if pan_signature is None or user_signature is None:
        print("Error processing signatures")
        return False

    # Step 3: Compare
    diff = calculate_difference(pan_signature, user_signature)

    print(f" Difference Score: {diff:.2f}")

    # Step 4: Decision
    if diff < threshold:
        print("\n SIGNATURE MATCHED")
        return True
    else:
        print("\n SIGNATURE NOT MATCHED")
        return False


# -----------------------------------
# ENTRY POINT (RUN FILE)
# -----------------------------------
if __name__ == "__main__":
    pan_image = "captured_pan.jpg"       # PAN card image
    user_signature = "user_signature.png"  # from your canvas

    result = verify_signature(pan_image, user_signature)

    print("\n--------------------------")
    if result:
        print(" SIGNATURE VERIFIED")
    else:
        print(" SIGNATURE MISMATCH")
    print("--------------------------")