import cv2
import mediapipe as mp
import numpy as np
import random
import sys


mp_hands = mp.solutions.hands
mp_draw = mp.solutions.drawing_utils
hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.7)


reference_points = {
    '0': [(0.4,0.3),(0.3,0.5),(0.4,0.7),(0.6,0.7),(0.7,0.5),(0.6,0.3),(0.4,0.3)],  # closed oval
    '1': [(0.5,0.25),(0.5,0.45),(0.5,0.65),(0.5,0.85)],
    '2': [(0.25,0.35),(0.75,0.35),(0.75,0.55),(0.25,0.85),(0.75,0.85)],
    '3': [(0.25,0.25),(0.75,0.25),(0.5,0.5),(0.75,0.75),(0.25,0.75)],
    '4': [(0.25,0.3),(0.25,0.5),(0.75,0.5),(0.75,0.75)],
    '5': [(0.75,0.25),(0.25,0.25),(0.25,0.5),(0.75,0.5),(0.75,0.75),(0.25,0.75)],
    '6': [(0.65,0.3),(0.4,0.4),(0.35,0.6),(0.45,0.75),(0.65,0.75),(0.7,0.55),(0.55,0.45),(0.4,0.6),(0.65,0.3)],  # loop bottom closed
    '7': [(0.25,0.25),(0.75,0.25),(0.5,0.75)],
    '8': [(0.5,0.25),(0.35,0.4),(0.5,0.55),(0.65,0.4),(0.5,0.25), (0.35,0.6),(0.5,0.75),(0.65,0.6),(0.5,0.55)],  # two closed loops
    '9': [(0.35,0.45),(0.55,0.3),(0.7,0.45),(0.7,0.6),(0.55,0.7),(0.35,0.55),(0.35,0.45)]  # closed top loop
}

drawing_points_norm = []
recording = False
target_number = random.choice(list(reference_points.keys()))
TOLERANCE = 0.08

print(f" Draw the number '{target_number}' in the air following the numbered checkpoints.")
print("Controls: 's' start | 'e' end (verify) | 'r' reset | 'q' quit")


cap = cv2.VideoCapture(0)

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        break

    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb)

    checkpoints = reference_points[target_number]
    for idx, (cx, cy) in enumerate(checkpoints, start=1):
        px, py = int(cx * w), int(cy * h)
        cv2.circle(frame, (px, py), 12, (0, 215, 255), -1)
        cv2.circle(frame, (px, py), 14, (0, 120, 200), 2)
        cv2.putText(frame, str(idx), (px - 8, py + 8), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)

    cv2.putText(frame, f"Target: {target_number} | s=start | e=end | r=reset | q=quit",
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 255, 50), 2)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            tip = hand_landmarks.landmark[8]
            x_px, y_px = int(tip.x * w), int(tip.y * h)
            x_norm, y_norm = float(tip.x), float(tip.y)

            cv2.circle(frame, (x_px, y_px), 6, (0, 255, 0), -1)

            if recording:
                drawing_points_norm.append((x_norm, y_norm))
                for i in range(1, len(drawing_points_norm)):
                    x1, y1 = int(drawing_points_norm[i - 1][0] * w), int(drawing_points_norm[i - 1][1] * h)
                    x2, y2 = int(drawing_points_norm[i][0] * w), int(drawing_points_norm[i][1] * h)
                    cv2.line(frame, (x1, y1), (x2, y2), (255, 0, 0), 3)

    cv2.imshow("Checkpoint Air-Draw Verification", frame)
    key = cv2.waitKey(1) & 0xFF

    
    if key == ord('s'):
        drawing_points_norm = []
        recording = True
        print(" Recording started. Draw your number...")

   
    elif key == ord('e'):
        recording = False
        if len(drawing_points_norm) < 5:
            print("⚠️ Not enough movement captured. Try again.")
            continue

        all_hit = True
        missed = []
        for idx, (cx, cy) in enumerate(checkpoints, start=1):
            if not any(np.linalg.norm([cx - px, cy - py]) <= TOLERANCE for px, py in drawing_points_norm):
                all_hit = False
                missed.append(idx)

        if all_hit:
            print(f"VERIFIED: all checkpoints hit for '{target_number}'")
            print("Returning to main program...")
            cap.release()
            cv2.destroyAllWindows()
            sys.exit(0)   
        else:
            print(f"NOT VERIFIED: missed checkpoints {missed}")
            print("Make sure to draw all checkpoints closely.")
            drawing_points_norm = []

   
    elif key == ord('r'):
        drawing_points_norm = []
        recording = False
        print(" Reset done. Press 's' to start again.")

    
    elif key == ord('q'):
        print(" Exiting...")
        break

cap.release()
cv2.destroyAllWindows()
