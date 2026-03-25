import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, 'outputs')
os.makedirs(OUTPUT_DIR, exist_ok=True)
PAN_CAPTURE_FRAMES = 7
VOICE_GUIDANCE = True
DEEPFAKE_MODEL_PATH = os.path.join(BASE_DIR, 'models', 'deepfake_model.h5')