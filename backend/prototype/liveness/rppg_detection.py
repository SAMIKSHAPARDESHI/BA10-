import cv2
import numpy as np
import time
from scipy.fft import rfft, rfftfreq
from scipy.signal import butter, filtfilt


def bandpass_filter(data, low, high, fs, order=3):
    nyquist = 0.5 * fs
    low /= nyquist
    high /= nyquist
    b, a = butter(order, [low, high], btype='band')
    return filtfilt(b, a, data)


def detect_rppg_liveness(duration=10):
    cap = cv2.VideoCapture(0)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    print("\n❤️ Starting rPPG Liveness Detection")
    print("➡ Stay still and face the camera")

    signal = []
    start_time = None

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps == 0 or np.isnan(fps):
        fps = 30

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 1:
            (x, y, w, h) = faces[0]

            if start_time is None:
                start_time = time.time()
                signal.clear()
                print("✅ Face detected, recording rPPG")

            fy1 = int(y + 0.15 * h)
            fy2 = int(y + 0.35 * h)
            fx1 = int(x + 0.25 * w)
            fx2 = int(x + 0.75 * w)

            roi = frame[fy1:fy2, fx1:fx2]
            if roi.size > 0:
                signal.append(np.mean(roi[:, :, 1]))

            elapsed = time.time() - start_time
            cv2.putText(frame, f"Recording: {int(elapsed)}s",
                        (30, 100), cv2.FONT_HERSHEY_SIMPLEX,
                        0.8, (0, 255, 0), 2)

            if elapsed >= duration:
                break

        cv2.imshow("rPPG Detection", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    if len(signal) < 20:
        print("❌ rPPG failed (not enough data)")
        return False

    signal = np.array(signal)
    signal = (signal - np.mean(signal)) / np.std(signal)

    filtered = bandpass_filter(signal, 0.7, 4.0, fps)
    yf = np.abs(rfft(filtered))
    xf = rfftfreq(len(filtered), 1 / fps)

    bpm = xf[np.argmax(yf)] * 60
    print(f"❤️ BPM Detected: {bpm:.2f}")

    if 30 < bpm < 100:
        print("✅ rPPG verification successful")
        return True
    else:
        print("❌ rPPG verification failed")
        return False


if __name__ == "__main__":
    if detect_rppg_liveness(duration=10):
        print("RPPG_SUCCESS")
    else:
        print("RPPG_FAILED")

