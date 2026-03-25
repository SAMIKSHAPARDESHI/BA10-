import time
import pyttsx3
from liveness.blink import run_blink_detection
from liveness.rppg_detection import detect_rppg_liveness
from liveness.hand_drawn_digit import run_air_digit_verification
from pan_capture.pan_capture import run_pan_capture




engine = pyttsx3.init()
def speak(text):
    engine.say(text)
    engine.runAndWait()

def ekyc_pipeline():
    speak("Welcome to the AI-based e-KYC Verification system.")
    print("🚀 Starting e-KYC verification...\n")

    # Step 1: Blink Detection
    speak("Step one: Liveness verification through blink detection.")
    print("👉 Step 1: Blink Detection")
    if not run_blink_detection():
        speak("Blink detection failed. Please retry.")
        print("❌ Blink verification failed.")
        return
    print("✅ Blink verification passed.\n")

    # Step 2: rPPG Detection
    speak("Now performing physiological liveness detection.")
    print("👉 Step 2: rPPG Liveness Detection")
    if not detect_rppg_liveness(5):
        speak("rPPG verification failed. Please retry.")
        print("❌ rPPG verification failed.")
        return
    print("✅ rPPG verification passed.\n")

    # Step 3: Air Digit Verification
    speak("Next step: Please draw the number shown on screen using your finger.")
    print("👉 Step 3: Air Digit Gesture Verification")
    if not run_air_digit_verification():
        speak("Air digit verification failed. Please retry.")
        print("❌ Air-digit verification failed.")
        return
    print("✅ Air-digit verification passed.\n")

    # Step 4: PAN Capture
    speak("Final step: Please scan your PAN card.")
    print("👉 Step 4: PAN Card Capture")
    run_pan_capture()

    speak("Verification complete. Thank you!")
    print("\n🎉 All verification steps successfully completed.")

if __name__ == "__main__":
    ekyc_pipeline()
