import cv2
import numpy as np
from scipy.fft import rfft, rfftfreq
from scipy.signal import butter, filtfilt


def bandpass_filter(data, low, high, fs, order=3):
    nyquist = 0.5 * fs
    low /= nyquist
    high /= nyquist
    b, a = butter(order, [low, high], btype='band')
    return filtfilt(b, a, data)


def detect_rppg_liveness(video_path, duration=10):
    cap = cv2.VideoCapture(video_path)

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    signal = []
    fps = cap.get(cv2.CAP_PROP_FPS)

    if fps == 0 or np.isnan(fps):
        fps = 30

    frame_count = 0
    max_frames = int(fps * duration)

    while True:
        ret, frame = cap.read()
        if not ret or frame_count > max_frames:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 1:
            (x, y, w, h) = faces[0]

            fy1 = int(y + 0.15 * h)
            fy2 = int(y + 0.35 * h)
            fx1 = int(x + 0.25 * w)
            fx2 = int(x + 0.75 * w)

            roi = frame[fy1:fy2, fx1:fx2]

            if roi.size > 0:
                signal.append(np.mean(roi[:, :, 1]))

        frame_count += 1

    cap.release()

    if len(signal) < 20:
        return False, 0

    signal = np.array(signal)
    signal = (signal - np.mean(signal)) / np.std(signal)

    filtered = bandpass_filter(signal, 0.8, 2.5, fps)
    yf = np.abs(rfft(filtered))
    xf = rfftfreq(len(filtered), 1 / fps)

    peak_power = np.max(yf)
    avg_power = np.mean(yf)

    if peak_power < 2 * avg_power:
        return False, 0

    bpm = xf[np.argmax(yf)] * 60

    if 0 < bpm < 100:
        return True, int(bpm)
    else:
        return False, int(bpm)