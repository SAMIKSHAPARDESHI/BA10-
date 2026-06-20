import face_recognition
import numpy as np

def get_face_embedding(image_path):
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)

    if len(encodings) == 0:
        return None

    return encodings[0]

def compare_faces(e1, e2):
    return np.linalg.norm(e1 - e2) < 0.6