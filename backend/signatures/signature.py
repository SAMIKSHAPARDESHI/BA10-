import cv2
import numpy as np
import time
import os

# Create folder for saving signatures
output_folder = "signatures"
os.makedirs(output_folder, exist_ok=True)

def draw_signature(event, x, y, flags, param):
    global drawing, last_point

    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        last_point = (x, y)

    elif event == cv2.EVENT_MOUSEMOVE:
        if drawing:
            cv2.line(img, last_point, (x, y), (0, 0, 0), 3)
            last_point = (x, y)

    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        cv2.line(img, last_point, (x, y), (0, 0, 0), 3)

# Create a white canvas
img = 255 * np.ones((400, 800, 3), dtype=np.uint8)
cv2.namedWindow("Signature Capture")
cv2.setMouseCallback("Signature Capture", draw_signature)

print("🖊️ Draw your signature in the window.")
print("Press 's' to save or 'r' to reset, 'q' to quit.")

drawing = False
last_point = None

while True:
    cv2.imshow("Signature Capture", img)
    key = cv2.waitKey(1) & 0xFF

    if key == ord('s'):
        filename = os.path.join(output_folder, f"signature_{int(time.time())}.png")
        cv2.imwrite(filename, img)
        print(f"✅ Signature saved as {filename}")
        break

    elif key == ord('r'):
        img = 255 * np.ones((400, 800, 3), dtype=np.uint8)
        print("↩️ Reset signature area.")

    elif key == ord('q'):
        print("❌ Exiting without saving.")
        break

cv2.destroyAllWindows()
