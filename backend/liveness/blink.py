import cv2
import mediapipe as mp
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'



def blink_detection(required_blinks=3):
    mp_face_mesh = mp.solutions.face_mesh
    mp_face_detection = mp.solutions.face_detection

    face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True)
    face_detector = mp_face_detection.FaceDetection(min_detection_confidence=0.5)

    cap = cv2.VideoCapture(0)

    blink_counter = 0
    blink_state = False

    print("\n Blink Detection Started")
    print(f"➡ Please blink {required_blinks} times")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results_mesh = face_mesh.process(frame_rgb)
        results_detection = face_detector.process(frame_rgb)

        # Check number of faces
        num_faces = 0
        if results_detection.detections:
            num_faces = len(results_detection.detections)

        if num_faces == 0:
            cv2.putText(frame, "No face detected!", (30, 100),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            cv2.imshow("Blink Detection", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            continue

        if num_faces > 1:
            cv2.putText(frame, " Multiple faces detected! Only one person allowed.",
                        (30, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            cv2.imshow("Blink Detection", frame)
            print(" Multiple faces detected! Blink verification aborted.")
            cap.release()
            cv2.destroyAllWindows()
            return False  # Stop verification if more than one face

        # Blink detection
        if results_mesh.multi_face_landmarks:
            face_landmarks = results_mesh.multi_face_landmarks[0]
            left_eye_top = face_landmarks.landmark[159]
            left_eye_bottom = face_landmarks.landmark[145]
            eye_open = abs(left_eye_top.y - left_eye_bottom.y)

            if eye_open < 0.015 and not blink_state:
                blink_state = True
                blink_counter += 1
            elif eye_open >= 0.015:
                blink_state = False

        cv2.putText(frame, f"Blinks: {blink_counter}/{required_blinks}",
                    (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        cv2.imshow("Blink Detection", frame)

        if blink_counter >= required_blinks:
            print("Blink verification successful")
            break

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    return blink_counter >= required_blinks


if __name__ == "__main__":
    if blink_detection(required_blinks=3):
        print("Blink verification successful")
        print("BLINK_SUCCESS")
    else:
        print("\n Blink verification failed")
        print("BLINK_FAILED")
