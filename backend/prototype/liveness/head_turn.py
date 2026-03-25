import cv2
import mediapipe as mp
import random

def head_turn_detection():
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True)

    cap = cv2.VideoCapture(0)

    # Random direction
    direction = random.choice(["LEFT", "RIGHT"])
    print(f"\n➡ Please turn your head {direction}")
    print("Press 'q' to quit")

    counter = 0
    REQUIRED_FRAMES = 8
    verified = False

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb)

        if results.multi_face_landmarks:
            landmarks = results.multi_face_landmarks[0].landmark

            nose = landmarks[1]
            left_cheek = landmarks[234]
            right_cheek = landmarks[454]

            face_center = (left_cheek.x + right_cheek.x) / 2
            offset = nose.x - face_center

           # Swap due to mirror
            if direction == "LEFT" and offset < -0.03:
                counter += 1

            elif direction == "RIGHT" and offset > 0.03:
                counter += 1

            else:
                counter = 0

            if counter > REQUIRED_FRAMES:
                verified = True

            cv2.putText(frame,
                        f"Turn {direction}",
                        (30, 50),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.9, (0, 255, 0), 2)

        cv2.imshow("Head Turn Detection", frame)

        if verified:
            print("✅ Head turn verified")
            break

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    return verified


if __name__ == "__main__":
    if head_turn_detection():
        print("Head movement verified")
        print("HEAD_SUCCESS")
    else:
        print("Head movement failed")
        print("HEAD_FAILED")
