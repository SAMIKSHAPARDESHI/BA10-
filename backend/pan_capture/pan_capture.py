import cv2
import numpy as np

SAVE_PATH = "captured_pan.jpg"


# -----------------------------
# Sharpness detector
# -----------------------------
def sharpness_score(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(gray, cv2.CV_64F).var()


# -----------------------------
# Improve image for OCR
# -----------------------------
def enhance_for_ocr(img):

    # upscale for OCR clarity
    img = cv2.resize(img, None, fx=2, fy=2,
                     interpolation=cv2.INTER_CUBIC)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # remove noise
    gray = cv2.bilateralFilter(gray, 9, 75, 75)

    # improve contrast
    clahe = cv2.createCLAHE(clipLimit=2.0,
                             tileGridSize=(8, 8))
    gray = clahe.apply(gray)

    return cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)


# -----------------------------
# Detect PAN card presence
# -----------------------------
def is_card_present(crop):

    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    edges = cv2.Canny(blur, 50, 150)

    contours, _ = cv2.findContours(
        edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    for cnt in contours:
        area = cv2.contourArea(cnt)

        if area < 4000:
            continue

        peri = cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, 0.03 * peri, True)

        if len(approx) == 4:
            return True

    return False


# -----------------------------
# Capture PAN card
# -----------------------------
def capture_pan():

    cam = cv2.VideoCapture(0)

    if not cam.isOpened():
        print("Camera not accessible")
        return

    print("Press C to capture PAN, Q to quit")

    while True:
        ret, frame = cam.read()
        if not ret:
            break

        h, w, _ = frame.shape

        x1, y1 = int(w * 0.05), int(h * 0.2)
        x2, y2 = int(w * 0.95), int(h * 0.8)

        crop = frame[y1:y2, x1:x2]

        card_present = is_card_present(crop)

        color = (0, 255, 0) if card_present else (0, 0, 255)

        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

        msg = "PAN Detected - Press C" if card_present else "PAN Missing"

        cv2.putText(frame, msg,
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7, color, 2)

        cv2.imshow("PAN Capture", frame)

        key = cv2.waitKey(1) & 0xFF

        # Capture best frame
        if key == ord('c'):

            frames = []
            scores = []

            for i in range(5):
                ret, frame = cam.read()
                if not ret:
                    continue

                crop = frame[y1:y2, x1:x2]

                score = sharpness_score(crop)
                frames.append(crop)
                scores.append(score)

                display = frame.copy()
                cv2.putText(display,
                            f"Capturing {i+1}/5",
                            (50, 50),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1,
                            (0, 255, 255),
                            2)

                cv2.imshow("PAN Capture", display)
                cv2.waitKey(120)

            if frames:
                best_frame = frames[np.argmax(scores)]

                # ✅ Enhancement added here
                enhanced = enhance_for_ocr(best_frame)

                cv2.imwrite(SAVE_PATH, enhanced)
                print("Saved enhanced captured_pan.jpg")
                break

        if key == ord('q'):
            break

    cam.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    capture_pan()
