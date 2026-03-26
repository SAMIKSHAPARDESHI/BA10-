import cv2
import numpy as np
import os

# -------------------------------
# FACE DETECTOR SETUP
# -------------------------------
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

# -------------------------------
# FUNCTION: Extract Face
# -------------------------------
def extract_face(image_path):
    img = cv2.imread(image_path)

    if img is None:
        print(f"❌ Cannot read image: {image_path}")
        return None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    if len(faces) == 0:
        return None

    x, y, w, h = faces[0]
    face = gray[y:y+h, x:x+w]

    # Normalize size
    face = cv2.resize(face, (200, 200))
    return face


# -------------------------------
# FUNCTION: Compare Faces
# -------------------------------
def compare_faces(face1, face2):
    difference = np.mean(cv2.absdiff(face1, face2))
    return difference


# -------------------------------
# MAIN VERIFICATION LOGIC
# -------------------------------
def verify_identity(pan_image_path, blink_folder_path, threshold=50):
    print("\n🔍 Starting Face Verification...\n")

    reference_face = extract_face(pan_image_path)

    if reference_face is None:
        print("❌ No face detected in PAN image")
        return False

    match_found = False

    for file in os.listdir(blink_folder_path):
        file_path = os.path.join(blink_folder_path, file)

        test_face = extract_face(file_path)
        if test_face is None:
            continue

        diff = compare_faces(reference_face, test_face)
        print(f"{file} → Difference Score: {diff:.2f}")

        if diff < threshold:
            print(f"\n✅ MATCH FOUND → {file}")
            match_found = True
            break

    if not match_found:
        print("\n❌ NO MATCH FOUND")

    return match_found


# -------------------------------
# ENTRY POINT
# -------------------------------
if __name__ == "__main__":
    pan_image = "captured_pan.jpg"
    blink_folder = "blink_photos"

    result = verify_identity(pan_image, blink_folder)

    print("\n--------------------------")
    if result:
        print("🔐 IDENTITY VERIFIED")
    else:
        print("🚫 IDENTITY NOT VERIFIED")
    print("--------------------------")