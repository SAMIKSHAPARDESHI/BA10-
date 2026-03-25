import tkinter as tk
from tkinter import messagebox
import cv2
import mediapipe as mp
import os
import time
import threading

# Function to capture face when user clicks Start eKYC
def start_ekyc():
    def capture_face():
        mp_face = mp.solutions.face_detection
        mp_drawing = mp.solutions.drawing_utils

        # Create folder for storing face images
        if not os.path.exists("ekyc_data"):
            os.makedirs("ekyc_data")

        cap = cv2.VideoCapture(0)
        with mp_face.FaceDetection(model_selection=0, min_detection_confidence=0.6) as face_detector:
            captured = False
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break

                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = face_detector.process(rgb_frame)

                if results.detections:
                    for detection in results.detections:
                        mp_drawing.draw_detection(frame, detection)

                    if not captured:
                        timestamp = int(time.time())
                        face_path = f"ekyc_data/face_{timestamp}.jpg"
                        cv2.imwrite(face_path, frame)
                        captured = True
                        print(f"Face captured and saved to {face_path}")
                        messagebox.showinfo("Success", "Face captured! Proceeding to next steps...")

                cv2.imshow("eKYC - Face Capture", frame)
                if cv2.waitKey(1) & 0xFF == ord('q') or captured:
                    break

        cap.release()
        cv2.destroyAllWindows()

    # Run in separate thread to avoid freezing GUI
    threading.Thread(target=capture_face).start()

# Tkinter GUI
root = tk.Tk()
root.title("Automated eKYC")
root.geometry("400x200")

label = tk.Label(root, text="Welcome to Automated eKYC", font=("Arial", 16))
label.pack(pady=20)

start_btn = tk.Button(root, text="Start eKYC", font=("Arial", 14), bg="green", fg="white", command=start_ekyc)
start_btn.pack(pady=10)

exit_btn = tk.Button(root, text="Exit", font=("Arial", 12), bg="red", fg="white", command=root.destroy)
exit_btn.pack(pady=10)

root.mainloop()
