from flask import Flask, request, jsonify
from flask_cors import CORS
from prototype.liveness.blink import blink_detection
from prototype.liveness.rppg_detection import detect_rppg_liveness

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/')
def home():
    return "eKYC Backend Running 🚀"


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

    if not video:
        return jsonify({"error": "No video received"}), 400

    video_path = "temp_rppg.webm"
    video.save(video_path)

    is_real, bpm = detect_rppg_liveness(video_path)

    if is_real:
        return jsonify({"status": "REAL", "bpm": bpm})
    else:
        return jsonify({"status": "FAKE", "bpm": bpm})


if __name__ == "__main__":
    app.run(debug=True, port =5001)