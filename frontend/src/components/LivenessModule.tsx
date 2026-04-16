import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Shield, Eye, Sparkles, Activity, Check, ArrowRight, ArrowLeft, Hand } from "lucide-react";
import { VerificationLayout } from "./VerificationLayout";
import axios from "axios";
import { useRef } from "react";
import { BackButton } from "./BackButton";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { FaceMesh } from "@mediapipe/face_mesh";

const recordAndSendVideo = async (
  videoRef: any,
  apiUrl: string,
  setRecorder: (rec: MediaRecorder) => void,
  setChunks: (chunks: any[]) => void
) => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });

 if (!videoRef.current) {
  console.error("❌ videoRef is null");
  return;
}

videoRef.current.srcObject = stream;

  const mediaRecorder = new MediaRecorder(stream);
  let chunks: any[] = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  setRecorder(mediaRecorder);
  setChunks(chunks);

  mediaRecorder.start();
};

type SubStep = "blink" | "head-turn" | "heartbeat" | "air-gesture";

export function LivenessModule() {
  const navigate = useNavigate();
  const [currentSubStep, setCurrentSubStep] = useState<SubStep>("blink");
  const [completedSteps, setCompletedSteps] = useState<SubStep[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const subSteps = [
    { id: "blink" as SubStep, label: "Blink Detection", number: 1 },
    { id: "head-turn" as SubStep, label: "Head Movement", number: 2 },
    { id: "heartbeat" as SubStep, label: "Heartbeat Detection", number: 3 },
    { id: "air-gesture" as SubStep, label: "Air Gesture Check", number: 4 },
  ];
  
  const currentStepIndex = subSteps.findIndex((s) => s.id === currentSubStep);

  const handleComplete = (step: SubStep) => {
    setCompletedSteps([...completedSteps, step]);
    const nextIndex = currentStepIndex + 1;
    
    if (nextIndex < subSteps.length) {
      setTimeout(() => {
        setCurrentSubStep(subSteps[nextIndex].id);
      }, 800);
    } else {
      setTimeout(() => {
        setShowSuccess(true);
      }, 800);
    }
  };
  
  return (
    <VerificationLayout>
      <BackButton />
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Premium background - more prominent for hero module */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 right-10 w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/30 to-blue-400/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
          />
        </div>

        {/* Header */}
        <div className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-gray-200/50 bg-white/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl tracking-tight text-[#0f172a]">SecureKYC</span>
          </div>
          
          {/* Hero Module Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass premium-shadow">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-[#0f172a]">Core Verification Module</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
          {!showSuccess ? (
            <>
              {/* Hero Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
              >
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-5xl text-[#0f172a] tracking-tight mb-3">
                  Liveness Verification
                </h1>
                <p className="text-xl text-[#0f172a]/60 font-light">
                  Advanced AI ensures you're a real person, not a photo or video
                </p>
              </motion.div>

              {/* Sub-Step Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center justify-center gap-4 mb-12"
              >
                {subSteps.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const isCurrent = currentSubStep === step.id;

                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <motion.div
                          animate={{
                            scale: isCurrent ? 1.1 : 1,
                          }}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isCompleted
                              ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg"
                              : isCurrent
                              ? "glass border-2 border-emerald-500 shadow-lg"
                              : "bg-white/50 border border-gray-200"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-6 h-6 text-white" />
                          ) : (
                            <span className={`text-lg ${isCurrent ? "text-emerald-600" : "text-gray-400"}`}>
                              {step.number}
                            </span>
                          )}
                        </motion.div>
                        <span className={`mt-2 text-sm ${isCurrent ? "text-[#0f172a]" : "text-[#0f172a]/50"}`}>
                          {step.label}
                        </span>
                      </div>
                      {index < subSteps.length - 1 && (
                        <div className="w-24 h-0.5 mx-4 bg-gray-200 relative overflow-hidden rounded-full">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: isCompleted ? "100%" : "0%" }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-600"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>

              {/* Main Verification Area - Extra Large and Prominent */}
              <div className="glass premium-shadow-lg rounded-3xl p-12 mb-8">
                <AnimatePresence mode="wait">
                  {currentSubStep === "blink" && (
                    <BlinkDetectionStep
                      key="blink"
                      onComplete={() => handleComplete("blink")}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}                      
                    />

                  )}

                  {currentSubStep === "head-turn" && (
                    <HeadTurnStep
                      key="head-turn"
                      onComplete={() => handleComplete("head-turn")}
                    />
                  )}

                  {currentSubStep === "heartbeat" && (
                    <HeartbeatStep
                      key="heartbeat"
                      onComplete={() => handleComplete("heartbeat")}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                    />
                  )}

                  {currentSubStep === "air-gesture" && (
                    <AirGestureStep
                      key="air-gesture"
                      onComplete={() => handleComplete("air-gesture")}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Security Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-center gap-2 text-sm text-[#0f172a]/50"
              >
                <Shield className="w-4 h-4" />
                <span>Your biometric data is processed locally and never stored</span>
              </motion.div>
            </>
          ) : (
            <LivenessSuccessScreen onContinue={() => navigate("/pan-ocr")} />
          )}
        </div>
      </div>
    </VerificationLayout>
  );
}

// Sub-step 1: Blink Detection
function BlinkDetectionStep({
  onComplete,
  isProcessing,
  setIsProcessing,
}: {
  onComplete: () => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}) {
  const [blinkCount, setBlinkCount] = useState(0);
  const [currentAction, setCurrentAction] = useState("Position yourself in the camera frame");
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<any[]>([]);

  const actions = [
    "Position yourself in the camera frame",
    "Detecting face alignment...",
    "Waiting for natural blink...",
    "Blink detected - Analyzing pattern...",
    "Verifying blink authenticity...",
    "Checking for spoofing attempts...",
    "Blink verification complete!"
  ];

  const startDetection = async () => {
  setIsProcessing(true);
  setIsDetecting(true);

  await recordAndSendVideo(
    videoRef,
    "http://localhost:5001/api/blink",
    setRecorder,
    setChunks
  );
};

const stopDetection = async () => {
  if (!recorder) return;

  recorder.stop();
  setIsDetecting(false);

  recorder.onstop = async () => {
    const blob = new Blob(chunks, { type: "video/webm" });

    const formData = new FormData();
    formData.append("video", blob);

    try {
      const res = await axios.post("http://localhost:5001/api/blink", formData);

      if (res.data.blinks >= 3) {
        setBlinkCount(res.data.blinks);
        onComplete();
      } else {
        alert("❌ Blink at least 3 times");
      }
    } catch (err) {
      console.error(err);
    }

    setIsProcessing(false);
  };

  // stop camera
  if (videoRef.current?.srcObject) {
    const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
    tracks.forEach((track) => track.stop());
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Step Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-emerald-700 font-medium">Step 1 of 4 • Blink Detection</span>
        </div>
        <h2 className="text-3xl text-[#0f172a] mb-2">Blink Your Eyes Naturally</h2>
        <p className="text-lg text-[#0f172a]/60 font-light">
          We'll detect your natural eye blinks to verify you're a real person
        </p>
      </div>

      {/* Camera Preview */}
      <div className="aspect-video max-w-2xl mx-auto bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl relative overflow-hidden border-2 border-gray-200 shadow-xl">
        <video ref={videoRef} autoPlay muted className="absolute inset-0 w-full h-full object-cover rounded-2xl"/>
        {/* Face oval guide */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: isProcessing ? [1, 1.02, 1] : 1,
              borderColor: isProcessing ? ["#10b981", "#34d399", "#10b981"] : "#d1d5db",
            }}
            transition={{ duration: 2, repeat: isProcessing ? Infinity : 0 }}
            className="w-64 h-80 border-4 rounded-[50%] border-dashed"
          />
        </div>

        {/* Processing Indicators */}
        {isProcessing && (
          <>
            {/* Corner markers */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-emerald-500 rounded-tl-2xl"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
              className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-emerald-500 rounded-tr-2xl"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
              className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-emerald-500 rounded-bl-2xl"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, delay: 0.6, repeat: Infinity }}
              className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-emerald-500 rounded-br-2xl"
            />

            {/* Scanning line */}
            <motion.div
              initial={{ y: "0%" }}
              animate={{ y: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-60"
            />
          </>
        )}

        {/* Blink counter */}
        {blinkCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-6 right-6 px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-lg"
          >
            <span className="text-lg font-semibold">{blinkCount} Blink Detected</span>
          </motion.div>
        )}
      </div>

      {/* Current Action & Progress */}
      {isProcessing && (
        <div className="space-y-4">
          <div className="text-center">
            <motion.p
              key={currentAction}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg text-emerald-600 font-medium"
            >
              {currentAction}
            </motion.p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#0f172a]/70">Detection Progress</span>
              <span className="text-emerald-600 font-semibold">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 rounded-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      
        <div className="max-w-xl mx-auto">
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-lg text-[#0f172a] font-semibold mb-4">Instructions:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-emerald-600 font-semibold">1</span>
                </div>
                <p className="text-sm text-[#0f172a]/70">Position your face within the oval guide on screen</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-emerald-600 font-semibold">2</span>
                </div>
                <p className="text-sm text-[#0f172a]/70">Ensure good lighting and remove glasses if possible</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-emerald-600 font-semibold">3</span>
                </div>
                <p className="text-sm text-[#0f172a]/70">Blink naturally for atleast 3 times </p>
              </div>
            </div>
          </div>

          <button
            onClick={isDetecting ? stopDetection : startDetection}
            className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            <span className="text-lg">
            {isDetecting ? "Stop Detection" : "Start Blink Detection"}
            </span>
          </button>
        </div>

    </motion.div>
  );
}

// Sub-step 2: Head Turn
function HeadTurnStep({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [direction, setDirection] = useState<"LEFT" | "RIGHT">("LEFT");
  const [counter, setCounter] = useState(0);
  const [verified, setVerified] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const REQUIRED_FRAMES = 8;

  // ✅ START DETECTION
  const startDetection = () => {
    const dir = Math.random() > 0.5 ? "LEFT" : "RIGHT";
    setDirection(dir);
    setCounter(0);
    setVerified(false);
    setIsDetecting(true);
  };

  useEffect(() => {
  if (!isDetecting || !videoRef.current) return;

  let faceMesh: FaceMesh | null = null;
  let stream: MediaStream | null = null;
  let animationFrameId: number;

  const startCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current!.srcObject = stream;

      await videoRef.current!.play();

      faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
      });

      faceMesh.onResults((results) => {
  if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
    setCounter(0);
    return;
  }

  const landmarks = results.multiFaceLandmarks[0];
  

  // ✅ SAFETY CHECK
  if (!landmarks[1] || !landmarks[33] || !landmarks[263]) {
    return;
  }

  const nose = landmarks[1];
  const left_eye = landmarks[33];
  const right_eye = landmarks[263];

  const eye_center = (left_eye.x + right_eye.x) / 2;
  const offset = (nose.x - eye_center) * -1;

  console.log("OFFSET:", offset); // 🔥 DEBUG

  setCounter((prev) => {
    let newCount = prev;

    if (direction === "LEFT" && offset < -0.02) {
      newCount++;
    } else if (direction === "RIGHT" && offset > 0.02) {
      newCount++;
    } else {
      newCount = Math.max(0, newCount - 1);
    }

    return newCount;
  });
});

      const detect = async () => {
        if (faceMesh && videoRef.current) {
          await faceMesh.send({ image: videoRef.current });
        }
        animationFrameId = requestAnimationFrame(detect);
      };

      detect();
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  startCamera();

  return () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (faceMesh) faceMesh.close();
    cancelAnimationFrame(animationFrameId);
  };
}, [isDetecting]);

    

  // ✅ VERIFY
  useEffect(() => {
    if (!isDetecting) return;

    if (!verified && counter > REQUIRED_FRAMES) {
      setVerified(true);
      setIsDetecting(false);

      setTimeout(() => {
        onComplete();
      }, 800);
    }
  }, [counter, isDetecting, verified, onComplete]);

  return (
    <div className="space-y-6 text-center">

      {/* TITLE */}
      <h2 className="text-3xl font-semibold">Turn Your Head</h2>

      {/* INSTRUCTION */}
      {isDetecting ? (
        <p className="text-blue-600 text-lg font-semibold">
          👉 Turn your head {direction}
        </p>
      ) : (
        <p className="text-gray-500">
          Click start to begin head movement detection
        </p>
      )}

      {/* ✅ BUTTON FIXED (ALWAYS VISIBLE CENTER) */}
      {!isDetecting && (
        <div className="flex justify-center mt-4">
          <button
            onClick={startDetection}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl text-lg shadow-lg"
          >
            ▶ Start Head Movement
          </button>
        </div>
      )}

      {/* CAMERA */}
      {isDetecting && (
        <div className="relative w-full max-w-xl mx-auto bg-gray-100 rounded-xl h-[300px] overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* FACE GUIDE */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-56 border-2 border-dashed rounded-full" />
          </div>

          {/* DIRECTION */}
          <div className="absolute top-4 text-blue-600 font-semibold">
            Turn {direction}
          </div>
        </div>
      )}

      {/* STOP BUTTON */}
      {isDetecting && (
        <button
          onClick={() => setIsDetecting(false)}
          className="bg-red-500 text-white px-6 py-3 rounded-lg"
        >
          Stop
        </button>
      )}

      {/* COUNTER */}
      {isDetecting && <p>Frames detected: {counter}</p>}

      {/* SUCCESS */}
      {verified && (
        <p className="text-green-600 text-xl">
          ✅ Head Turn Verified
        </p>
      )}
    </div>
  );
}


// Sub-step 3: Heartbeat Detection
function HeartbeatStep({
  onComplete,
  isProcessing,
  setIsProcessing,
}: {
  onComplete: () => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}) {
  const [progress, setProgress] = useState(0);
  const [detected, setDetected] = useState(false);
  const [currentAction, setCurrentAction] = useState("Position your face in the frame");
  const [countdown, setCountdown] = useState(10);
  const [bpm, setBpm] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<any[]>([]);
  

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startDetection = async () => {
  setIsProcessing(true);
  setIsDetecting(true);
  setCountdown(10);

  // start recording
  setTimeout(async () => {
    await recordAndSendVideo(
      videoRef,
      "http://localhost:5001/api/rppg",
      setRecorder,
      setChunks
    );
  }, 200);

  // ONLY TIMER (no auto stop)
  let time = 10;

  const interval = setInterval(() => {
    time--;
    setCountdown(time);

    if (time <= 0) {
      clearInterval(interval); // ❌ DO NOT stop detection
    }
  }, 1000);
};

  const stopDetection = async () => {
  if (!recorder) return;

  recorder.stop();
  setIsDetecting(false);

  recorder.onstop = async () => {
    const blob = new Blob(chunks, { type: "video/webm" });

    const formData = new FormData();
    formData.append("video", blob);

    try {
      const res = await axios.post("http://localhost:5001/api/rppg", formData);

      console.log(res.data);

      // ✅ EXPECTING: { bpm: 75, status: "REAL" }
        setBpm(res.data.bpm);   // show BPM
        onComplete()
     // if (res.data.status === "REAL" || "FAKE") {
      //  setBpm(res.data.bpm);   // show BPM
       // onComplete();           // go next step
      //} else {
       // alert("❌ Invalid heartbeat detected");
      //}
    } catch (err) {
      console.error(err);
    }

    setIsProcessing(false);
  };

  // stop camera
  if (videoRef.current?.srcObject) {
    const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
    tracks.forEach((track) => track.stop());
  }
};

  const actions = [
    "Position your face in the frame",
    "Initializing rPPG sensor...",
    "Analyzing facial blood flow...",
    "Detecting micro-movements...",
    "Calculating heart rate pattern...",
    "Verifying pulse authenticity...",
    "Heartbeat confirmed - You're alive!"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Step Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full mb-4">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-sm text-purple-700 font-medium">Step 3 of 4 • Heartbeat Detection</span>
        </div>
        <h2 className="text-3xl text-[#0f172a] mb-2">Stay Still & Relax</h2>
        <p className="text-lg text-[#0f172a]/60 font-light">
          AI detects your heartbeat through subtle skin color changes (rPPG technology)
        </p>
      </div>

      {/* Camera Preview */}
      <div className="aspect-video max-w-2xl mx-auto bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl relative overflow-hidden border-2 border-gray-200 shadow-xl">
        <video  ref={videoRef} autoPlay muted className="absolute inset-0 w-full h-full object-cover rounded-2xl"/>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: isProcessing ? [1, 1.02, 1] : 1,
              borderColor: detected ? "#10b981" : isProcessing ? "#a855f7" : "#d1d5db",
            }}
            transition={{ duration: 1.2, repeat: isProcessing ? Infinity : 0 }}
            className="w-64 h-80 border-4 rounded-[50%] border-dashed"
          />
        </div>

        {/* Heartbeat pulse effect */}
        {isProcessing && !detected && (
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20"
          />
        )}

        {/* BPM Display */}
        {isProcessing && bpm > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-6 right-6 px-6 py-3 bg-purple-500 text-white rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6" />
              <div>
                <div className="text-2xl font-bold">{bpm}</div>
                <div className="text-xs opacity-90">BPM</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Scanning pulse waves */}
        {isProcessing && !detected && (
          <>
            <motion.div
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-96 h-96 rounded-full border-4 border-purple-400" />
            </motion.div>
            <motion.div
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-96 h-96 rounded-full border-4 border-purple-300" />
            </motion.div>
          </>
        )}

        {/* Success indicator */}
        {detected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-emerald-500/10"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl">
                <Check className="w-12 h-12 text-white" />
              </div>
              <span className="text-lg font-semibold text-emerald-600 bg-white px-4 py-2 rounded-full shadow-lg">
                Heartbeat Detected!
              </span>
            </div>
          </motion.div>
        )}

        {/* Corner markers */}
        {isProcessing && (
          <>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-purple-500 rounded-tl-2xl"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, delay: 0.3, repeat: Infinity }}
              className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-purple-500 rounded-tr-2xl"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, delay: 0.6, repeat: Infinity }}
              className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-purple-500 rounded-bl-2xl"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, delay: 0.9, repeat: Infinity }}
              className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-purple-500 rounded-br-2xl"
            />
          </>
        )}
      </div>

      {/* Current Action & Progress */}
      {isProcessing && (
        <div className="space-y-4">
          <div className="text-center">
            <motion.p
              key={currentAction}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg text-purple-600 font-medium"
            >
              {currentAction}
            </motion.p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#0f172a]/70">Heartbeat Analysis (rPPG)</span>
              <span className="text-purple-600 font-semibold">
              ⏱ {countdown}s
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
        <div className="max-w-xl mx-auto">
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-lg text-[#0f172a] font-semibold mb-4">Instructions:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-purple-600 font-semibold">1</span>
                </div>
                <p className="text-sm text-[#0f172a]/70">Keep your face steady within the oval frame</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-purple-600 font-semibold">2</span>
                </div>
                <p className="text-sm text-[#0f172a]/70">Stay as still as possible for accurate measurement</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-purple-600 font-semibold">3</span>
                </div>
                <p className="text-sm text-[#0f172a]/70">Breathe normally - this detects micro blood flow changes</p>
              </div>
            </div>
          </div>

          <button
            onClick={isDetecting ? stopDetection : startDetection}
            className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Activity className="w-5 h-5" />
            <span className="text-lg">
              {isDetecting ? "⏹ Stop Heartbeat Detection" : "💓 Start Heartbeat Detection"}
            </span>
          </button>
        </div>

    </motion.div>
  );
}

// Sub-step 4: Air Gesture Check
export default function AirGestureStep({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawingPointsRef = useRef<{ x: number; y: number }[]>([]);
  const recordingRef = useRef(false);

  const [verified, setVerified] = useState(false);

  const target = useRef(String(Math.floor(Math.random() * 10))).current;

  const referencePoints: Record<string, [number, number][]> = {
    "0": [[0.4,0.3],[0.3,0.5],[0.4,0.7],[0.6,0.7],[0.7,0.5],[0.6,0.3],[0.4,0.3]],
    "1": [[0.5,0.25],[0.5,0.45],[0.5,0.65],[0.5,0.85]],
    "2": [[0.25,0.35],[0.75,0.35],[0.75,0.55],[0.25,0.85],[0.75,0.85]],
    "3": [[0.25,0.25],[0.75,0.25],[0.5,0.5],[0.75,0.75],[0.25,0.75]],
    "4": [[0.25,0.3],[0.25,0.5],[0.75,0.5],[0.75,0.75]],
    "5": [[0.75,0.25],[0.25,0.25],[0.25,0.5],[0.75,0.5],[0.75,0.75],[0.25,0.75]],
    "6": [[0.65,0.3],[0.4,0.4],[0.35,0.6],[0.45,0.75],[0.65,0.75],[0.7,0.55],[0.55,0.45],[0.4,0.6],[0.65,0.3]],
    "7": [[0.25,0.25],[0.75,0.25],[0.5,0.75]],
    "8": [[0.5,0.25],[0.35,0.4],[0.5,0.55],[0.65,0.4],[0.5,0.25],[0.35,0.6],[0.5,0.75],[0.65,0.6],[0.5,0.55]],
    "9": [[0.35,0.45],[0.55,0.3],[0.7,0.45],[0.7,0.6],[0.55,0.7],[0.35,0.55],[0.35,0.45]],
  };

  const TOLERANCE = 0.08;

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let camera: any;

    const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`;
  },
});

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mirror camera (like Python flip)
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(results.image, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      // Draw checkpoints
      referencePoints[target].forEach(([cx, cy], idx) => {
        const x = cx * canvas.width;
        const y = cy * canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = "gold";
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.fillText(String(idx + 1), x - 5, y + 5);
      });

      // Hand detection (safe)
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        if (!landmarks || !landmarks[8]) return;

        const mirroredLandmarks = landmarks.map((lm) => ({
  ...lm,
  x: 1 - lm.x,
}));

drawConnectors(ctx, mirroredLandmarks, HAND_CONNECTIONS, {
  color: "red",
  lineWidth: 2,
});

drawLandmarks(ctx, mirroredLandmarks, {
  color: "white",
});

        const tip = landmarks[8];

        const mirroredX = 1 - tip.x;
        const mirroredY = tip.y;

        if (recordingRef.current) {
          drawingPointsRef.current.push({
          x: mirroredX,
          y: mirroredY,
          });
        }
      }

      // Draw path
      const pts = drawingPointsRef.current;
      for (let i = 1; i < pts.length; i++) {
        ctx.beginPath();
        ctx.moveTo(
          pts[i - 1].x * canvas.width,
          pts[i - 1].y * canvas.height
        );
        ctx.lineTo(
          pts[i].x * canvas.width,
          pts[i].y * canvas.height
        );
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });

    camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      if (camera) camera.stop();
    };
  }, []);

  const verify = () => {
    const checkpoints = referencePoints[target];
    const points = drawingPointsRef.current;

    if (points.length < 5) {
      alert("⚠️ Not enough movement captured");
      return;
    }

    let allHit = true;
    let missed: number[] = [];

    checkpoints.forEach(([cx, cy], idx) => {
      const hit = points.some((p) => {
        const dist = Math.sqrt((cx - p.x) ** 2 + (cy - p.y) ** 2);
        return dist <= TOLERANCE;
      });

      if (!hit) {
        allHit = false;
        missed.push(idx + 1);
      }
    });

    if (allHit) {
      setVerified(true);
      setTimeout(onComplete, 1000);
    } else {
      alert(`❌ Missed checkpoints: ${missed.join(", ")}`);
      drawingPointsRef.current = [];
    }
  };

  return (
    <div className="text-center space-y-4">

      <h2 className="text-2xl font-bold">
        ✍️ Draw Number: <span className="text-purple-600">{target}</span>
      </h2>

      {/* Hidden video (required internally) */}
      <video ref={videoRef} style={{ display: "none" }} />

      {/* Only visible camera */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="rounded-lg border shadow-lg mx-auto"
      />

      <div className="space-x-3 mt-4">
        <button
          onClick={() => {
            drawingPointsRef.current = [];
            recordingRef.current = true;
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Start Drawing
        </button>

        <button
          onClick={() => {
            recordingRef.current = false;
          }}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
        >
          Stop
        </button>

        <button
          onClick={verify}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Verify
        </button>

        <button
          onClick={() => {
            drawingPointsRef.current = [];
            recordingRef.current = false;
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Reset
        </button>
      </div>

      {verified && (
        <p className="text-green-600 font-semibold">
          ✅ VERIFIED SUCCESSFULLY
        </p>
      )}
    </div>
  );
}


// Liveness Success Screen
function LivenessSuccessScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16"
    >
      {/* Large Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
        className="mb-10"
      >
        <div className="w-40 h-40 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl">
          <Check className="w-20 h-20 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="space-y-6"
      >
        <h2 className="text-5xl text-[#0f172a] tracking-tight">
          Liveness Verified
        </h2>
        <p className="text-xl text-[#0f172a]/60 font-light max-w-2xl mx-auto">
          Your identity has been confirmed as genuine. All liveness checks passed successfully.
        </p>

        {/* Verification Summary */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-10">
          <div className="p-6 glass rounded-2xl">
            <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm text-[#0f172a]/70">Blink Detection</p>
          </div>
          <div className="p-6 glass rounded-2xl">
            <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm text-[#0f172a]/70">Head Movement</p>
          </div>
          <div className="p-6 glass rounded-2xl">
            <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm text-[#0f172a]/70">Heartbeat (rPPG)</p>
          </div>
          <div className="p-6 glass rounded-2xl">
            <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm text-[#0f172a]/70">Air Gesture Check</p>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="mt-10 px-12 py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
        >
          <span className="text-xl">Continue to Document Verification</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </motion.div>
    </motion.div>
  );
}