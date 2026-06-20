from flask import Flask, request, jsonify
from flask_cors import CORS
from prototype.liveness.blink import blink_detection
from prototype.liveness.rppg_detection import detect_rppg_liveness

import uuid
from face_utils import get_face_embedding, compare_faces  # create this file if not yet

session_store = {}

import pytesseract
import base64
import cv2
import numpy as np
import re
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

import speech_recognition as sr
import tempfile
from pydub import AudioSegment
import os

# ✅ FIRST define path
ffmpeg_path = r"C:\Users\DELL\Downloads\ffmpeg-8.1-essentials_build\ffmpeg-8.1-essentials_build\bin\ffmpeg.exe"

# ✅ THEN use it
AudioSegment.converter = ffmpeg_path
os.environ["PATH"] += os.pathsep + os.path.dirname(ffmpeg_path)
r = sr.Recognizer()

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True
)

@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    return response

@app.route('/')
def home():
    return "eKYC Backend Running 🚀"

@app.route('/api/start-session', methods=['POST'])
def start_session():
    try:
        data = request.get_json()

        if not data or "image" not in data:
            return jsonify({"error": "No image received"}), 400

        image_data = data["image"].split(",")[1]
        image_bytes = base64.b64decode(image_data)

        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Image decode failed"}), 400

        session_id = str(uuid.uuid4())
        path = f"{session_id}_start.jpg"

        cv2.imwrite(path, img)

        print("Saved image path:", path)

        embedding = get_face_embedding(path)

        print("Embedding generated")

        if embedding is None:
            return jsonify({"error": "Face not detected"}), 400

        session_store[session_id] = {
            "embedding": embedding.tolist(),
            "image_path": path
        }

        return jsonify({"session_id": session_id})

    except Exception as e:
        print("START SESSION ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/blink', methods=['POST'])
def blink_api():
    video = request.files.get('video')

    if not video:
        return jsonify({"error": "No video received"}), 400

    video_path = "temp_blink.webm"
    video.save(video_path)

    is_real, blinks = blink_detection(video_path)

    if is_real:
        return jsonify({"status": "REAL", "blinks": blinks})
    else:
        return jsonify({"status": "FAKE", "blinks": blinks})

@app.route('/api/rppg', methods=['POST'])
def rppg_api():
    video = request.files.get('video')
    session_id = request.form.get("session_id")

    if not video:
        return jsonify({"error": "No video received"}), 400

    if session_id not in session_store:
        return jsonify({"error": "Invalid session"}), 400

    video_path = "temp_rppg.webm"
    video.save(video_path)

    # extract frame
    cap = cv2.VideoCapture(video_path)
    ret, frame = cap.read()
    cap.release()

    if not ret:
        return jsonify({"error": "Frame extraction failed"}), 400

    frame_path = "temp_face.jpg"
    cv2.imwrite(frame_path, frame)

    current_embedding = get_face_embedding(frame_path)

    if current_embedding is None:
        return jsonify({"error": "No face detected"}), 400

    stored_embedding = np.array(session_store[session_id]["embedding"])

    if not compare_faces(stored_embedding, current_embedding):
        return jsonify({
            "status": "FAILED",
            "reason": "Different person detected"
        }), 403

    is_real, bpm = detect_rppg_liveness(video_path)

    return jsonify({
        "status": "REAL" if is_real else "FAKE",
        "bpm": bpm
    })
    


    session_id = request.form.get("session_id")
    image = request.files.get("image")

    if session_id not in session_store:
        return jsonify({"error": "Invalid session"}), 400

    if not image:
        return jsonify({"error": "No image received"}), 400

    path = "temp_head.jpg"
    image.save(path)

    current_embedding = get_face_embedding(path)

    if current_embedding is None:
        return jsonify({"error": "No face detected"}), 400

    stored_embedding = np.array(session_store[session_id]["embedding"])

    if not compare_faces(stored_embedding, current_embedding):
        return jsonify({
            "status": "FAILED",
            "reason": "Different person detected"
        }), 403

    return jsonify({
        "status": "REAL"
    })

@app.route('/api/pan', methods=['POST'])
def pan_ocr():
    data = request.get_json()

    if not data or "image" not in data:
        return jsonify({"error": "No image received"}), 400

    try:
        # Decode image
        image_data = data["image"].split(",")[1]
        image_bytes = base64.b64decode(image_data)

        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Image decode failed"}), 400

        # OCR helpers
        def preprocess_variants(image):
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            gray = cv2.resize(gray, None, fx=2, fy=2)

            variants = [gray]

            _, otsu = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            variants.append(otsu)

            adap = cv2.adaptiveThreshold(
                gray, 255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY,
                31, 5
            )
            variants.append(adap)

            return variants

        def ocr_text(image, psm=6):
            return pytesseract.image_to_string(image, config=f"--oem 3 --psm {psm}")

        def collect_texts(image):
            texts = []
            for im in preprocess_variants(image):
                texts.append(ocr_text(im, 6))
                texts.append(ocr_text(im, 11))
            return texts

        def extract_pan(text):
            t = re.sub(r"[^A-Z0-9]", "", text.upper())
            m = re.search(r"[A-Z]{5}[0-9]{4}[A-Z]", t)
            return m.group(0) if m else ""

        def extract_dob(text):
            t = text.upper().replace("O", "0").replace("I", "1")

            m = re.search(r"\d{2}[/-]\d{2}[/-]\d{4}", t)
            if m:
                return m.group()

            return ""

        # Run OCR
        all_texts = collect_texts(img)
        full_text = " ".join(all_texts)

        # Extract PAN
        pan_number = ""
        for txt in all_texts:
            pan = extract_pan(txt)
            if pan:
                pan_number = pan
                break

        # Extract DOB
        dob = ""
        for txt in all_texts:
            d = extract_dob(txt)
            if d:
                dob = d
                break

        return jsonify({
            "pan": pan_number,
            "dob": dob
        })

    except Exception as e:
        print("PAN OCR ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

# =========================
# VOICE FORM (FINAL FIXED)
# =========================
@app.route('/api/voice-form', methods=['POST'])
def voice_form():
    audio_file = request.files.get('audio')

    if not audio_file:
        return jsonify({"error": "No audio received"}), 400

    # Save temp webm
    temp = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
    temp_path = temp.name
    temp.close()

    audio_file.save(temp_path)

    try:
        # 🔥 Convert webm → wav
        wav_path = temp_path.replace(".webm", ".wav")

        audio = AudioSegment.from_file(temp_path, format="webm")
        audio.export(wav_path, format="wav")

        # 🔥 Speech recognition
        with sr.AudioFile(wav_path) as source:
            audio_data = r.record(source, duration =5)

        text = r.recognize_google(audio_data, language="en-IN")

        return jsonify({
            "success": True,
            "text": text
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })

    finally:
        try:
            os.remove(temp_path)
            os.remove(wav_path)
        except:
            pass


# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(debug=True, port=5001)