import cv2
import mediapipe as mp
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'


def blink_detection(video_path, required_blinks=3):
    mp_face_mesh = mp.solutions.face_mesh
    mp_face_detection = mp.solutions.face_detection

    face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True)
    face_detector = mp_face_detection.FaceDetection(min_detection_confidence=0.5)

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        return False, 0

    blink_counter = 0
    blink_state = False

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results_mesh = face_mesh.process(frame_rgb)
        results_detection = face_detector.process(frame_rgb)

        # ✅ Face count check
        num_faces = len(results_detection.detections) if results_detection.detections else 0

        if num_faces != 1:
            cap.release()
            return False, blink_counter

        # ✅ Blink detection logic
        if results_mesh.multi_face_landmarks:
            face_landmarks = results_mesh.multi_face_landmarks[0]

            left_eye_top = face_landmarks.landmark[159]
            left_eye_bottom = face_landmarks.landmark[145]

            eye_open = abs(left_eye_top.y - left_eye_bottom.y)

            # 🔥 Blink condition
            if eye_open < 0.015 and not blink_state:
                blink_state = True
                blink_counter += 1

            elif eye_open >= 0.015:
                blink_state = False

        # ✅ Stop early if enough blinks
        if blink_counter >= required_blinks:
            break

    cap.release()

    # ✅ Final result
    is_real = blink_counter >= required_blinks
    return is_real, blink_counter


# 🔥 OPTIONAL: For local testing only (NOT used in API)
if __name__ == "__main__":
    video_path = "test.webm"  # put test video here

    result, blinks = blink_detection(video_path, required_blinks=3)

    if result:
        print(f"✅ Blink verification successful ({blinks} blinks)")
    else:
        print(f"❌ Blink verification failed ({blinks} blinks)")