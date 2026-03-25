import os
from datetime import datetime

import cv2
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAVE_DIR = os.path.join(BASE_DIR, "captured_pans")
MAX_FRAMES_PER_CAPTURE = 5


def sharpness_score(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(gray, cv2.CV_64F).var()


def is_card_present(crop):
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (7, 7), 0)

    edges = cv2.Canny(blur, 30, 120)
    edges = cv2.dilate(edges, None, iterations=2)
    edges = cv2.erode(edges, None, iterations=1)

    contours, _ = cv2.findContours(
        edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE
    )

    h, w = crop.shape[:2]
    crop_area = h * w

    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < crop_area * 0.08:
            continue

        x, y, cw, ch = cv2.boundingRect(cnt)
        aspect_ratio = cw / float(ch)
        coverage = area / float(crop_area)

        if 1.2 <= aspect_ratio <= 2.2 and 0.08 <= coverage <= 0.90:
            return True

    return False


def save_pan_image(image, save_dir=SAVE_DIR):
    os.makedirs(save_dir, exist_ok=True)
    filename = f"pan_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}.jpg"
    path = os.path.join(save_dir, filename)

    success = cv2.imwrite(path, image)
    if not success:
        print("Failed to save image")
        return None

    abs_path = os.path.abspath(path)
    print("Saved image at:", abs_path)
    return abs_path


def capture_best_frame(cam, x1, y1, x2, y2):
    frames = []
    scores = []

    for i in range(MAX_FRAMES_PER_CAPTURE):
        ret, frame = cam.read()
        if not ret:
            continue

        crop = frame[y1:y2, x1:x2]
        frames.append(crop.copy())
        scores.append(sharpness_score(crop))

        display = frame.copy()
        cv2.putText(
            display,
            f"Capturing {i + 1}/{MAX_FRAMES_PER_CAPTURE}",
            (40, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 255),
            2,
        )
        cv2.imshow("PAN Capture", display)
        cv2.waitKey(120)

    if not frames:
        return None

    best_index = int(np.argmax(scores))
    return frames[best_index]


def capture_pan():
    cam = cv2.VideoCapture(0)

    if not cam.isOpened():
        print("Camera not accessible")
        return None

    print("Align PAN inside the box")
    print("Press C to capture, Q to quit")

    saved_path = None

    try:
        while True:
            ret, frame = cam.read()
            if not ret:
                print("Failed to read from camera")
                break

            h, w, _ = frame.shape
            x1, y1 = int(w * 0.05), int(h * 0.20)
            x2, y2 = int(w * 0.95), int(h * 0.80)

            crop = frame[y1:y2, x1:x2]
            card_present = is_card_present(crop)

            color = (0, 255, 0) if card_present else (0, 165, 255)
            status_text = "Card-like object detected" if card_present else "Align PAN inside box"

            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(
                frame,
                status_text,
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                color,
                2,
            )

            cv2.putText(
                frame,
                "Press C to capture",
                (x1, y2 + 30 if y2 + 30 < h else h - 20),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 255),
                2,
            )

            cv2.imshow("PAN Capture", frame)
            key = cv2.waitKey(1) & 0xFF

            if key == ord("c"):
                best_frame = capture_best_frame(cam, x1, y1, x2, y2)
                if best_frame is None:
                    print("Capture failed")
                    continue

                saved_path = save_pan_image(best_frame)
                if saved_path is None:
                    print("Image save failed")
                    continue

                break

            if key == ord("q"):
                break

    finally:
        cam.release()
        cv2.destroyAllWindows()

    return saved_path


if __name__ == "__main__":
    image_path = capture_pan()
    print("Returned path:", image_path)
