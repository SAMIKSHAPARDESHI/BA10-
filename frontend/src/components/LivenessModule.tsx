import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Shield, Eye, Sparkles, Activity, Check, ArrowRight, ArrowLeft, Hand } from "lucide-react";
import { VerificationLayout } from "./VerificationLayout";
import axios from "axios";
import { useRef } from "react";
import { BackButton } from "./BackButton";
const recordAndSendVideo = async (
  videoRef: any,
  apiUrl: string,
  onSuccess: () => void,
  setIsProcessing: (val: boolean) => void
) => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });

  videoRef.current.srcObject = stream;

  const mediaRecorder = new MediaRecorder(stream);
  let chunks: any[] = [];

  mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  mediaRecorder.onstop = async () => {
    const blob = new Blob(chunks, { type: "video/webm" });

    const formData = new FormData();
    formData.append("video", blob);

    try {
      const res = await axios.post(apiUrl, formData);
      console.log(res.data);
      onSuccess();
    } catch (err) {
      console.error(err);
    }

    setIsProcessing(false);
  };

  mediaRecorder.start();

  setTimeout(() => {
    mediaRecorder.stop();
  }, 5000);
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
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
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
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
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

  await recordAndSendVideo(
    videoRef,
    "http://localhost:5000/api/blink",
    () => {
      setBlinkCount(1);
      onComplete();
    },
    setIsProcessing
  );
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
      {!isProcessing && (
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
                <p className="text-sm text-[#0f172a]/70">Blink naturally when prompted - don't force it</p>
              </div>
            </div>
          </div>

          <button
            onClick={startDetection}
            className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            <span className="text-lg">Start Blink Detection</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}

// Sub-step 2: Head Turn
function HeadTurnStep({
  onComplete,
  isProcessing,
  setIsProcessing,
}: {
  onComplete: () => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}) {
  const [direction, setDirection] = useState<"left" | "right" | "complete">("left");
  const [currentAction, setCurrentAction] = useState("Position your face in the frame");
  const [progress, setProgress] = useState(0);

  const actions = [
    "Position your face in the frame",
    "Calibrating head position...",
    "Please turn your head slowly to the LEFT",
    "Analyzing left profile...",
    "Capturing left side landmarks...",
    "Now turn your head slowly to the RIGHT",
    "Analyzing right profile...",
    "Capturing right side landmarks...",
    "Verifying 3D facial structure...",
    "Head movement verification complete!"
  ];

  const startDetection = () => {
    setIsProcessing(true);
    setProgress(0);
    let actionIndex = 0;
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += 2.5;
      setProgress(currentProgress);

      if (currentProgress >= 10 && actionIndex === 0) {
        actionIndex++;
        setCurrentAction(actions[actionIndex]);
      } else if (currentProgress >= 20 && actionIndex === 1) {
        actionIndex++;
        setCurrentAction(actions[actionIndex]);
      } else if (currentProgress >= 30 && actionIndex === 2) {
        actionIndex++;
        setCurrentAction(actions[actionIndex]);
      } else if (currentProgress >= 40 && actionIndex === 3) {
        actionIndex++;
        setCurrentAction(actions[actionIndex]);
        setDirection("right");
      } else if (currentProgress >= 50 && actionIndex === 4) {
        actionIndex++;
        setCurrentAction(actions[actionIndex]);
      } else if (currentProgress >= 60 && actionIndex === 5) {
        actionIndex++;
        setCurrentAction(actions[actionIndex]);
      } else if (currentProgress >= 75 && actionIndex === 6) {
        actionIndex++;
        setCurrentAction(actions[actionIndex]);
      } else if (currentProgress >= 90 && actionIndex === 7) {
        actionIndex++;
        setCurrentAction(actions[actionIndex]);
      } else if (currentProgress >= 100) {
        clearInterval(progressInterval);
        setDirection("complete");
        actionIndex = 9;
        setCurrentAction(actions[actionIndex]);
        setTimeout(() => {
          setIsProcessing(false);
          onComplete();
        }, 1000);
      }
    }, 80);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Step Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-4">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm text-blue-700 font-medium">Step 2 of 4 • Head Movement</span>
        </div>
        <h2 className="text-3xl text-[#0f172a] mb-2">Turn Your Head</h2>
        <p className="text-lg text-[#0f172a]/60 font-light">
          Slowly turn your head left, then right to verify 3D face structure
        </p>
      </div>

      {/* Camera Preview */}
      <div className="aspect-video max-w-2xl mx-auto bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl relative overflow-hidden border-2 border-gray-200 shadow-xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: isProcessing ? [1, 1.02, 1] : 1,
              borderColor: direction === "complete" ? "#10b981" : isProcessing ? "#3b82f6" : "#d1d5db",
            }}
            transition={{ duration: 2, repeat: isProcessing ? Infinity : 0 }}
            className="w-64 h-80 border-4 rounded-[50%] border-dashed"
          />
        </div>

        {/* Direction indicators */}
        {isProcessing && direction !== "complete" && (
          <>
            <motion.div
              animate={{
                opacity: direction === "left" ? [0.3, 1, 0.3] : 0,
                x: direction === "left" ? [-5, 0, -5] : 0,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
              className="absolute left-8 top-1/2 -translate-y-1/2"
            >
              <div className="flex flex-col items-center gap-2">
                <ArrowLeft className="w-16 h-16 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 bg-white/90 px-3 py-1 rounded-full">Turn LEFT</span>
              </div>
            </motion.div>
            <motion.div
              animate={{
                opacity: direction === "right" ? [0.3, 1, 0.3] : 0,
                x: direction === "right" ? [5, 0, 5] : 0,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
              className="absolute right-8 top-1/2 -translate-y-1/2"
            >
              <div className="flex flex-col items-center gap-2">
                <ArrowRight className="w-16 h-16 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 bg-white/90 px-3 py-1 rounded-full">Turn RIGHT</span>
              </div>
            </motion.div>
          </>
        )}

        {/* Success indicator */}
        {direction === "complete" && (
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
                Movement Verified!
              </span>
            </div>
          </motion.div>
        )}

        {/* Corner markers for tracking */}
        {isProcessing && (
          <>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-blue-500 rounded-tl-2xl"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
              className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-blue-500 rounded-tr-2xl"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
              className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-blue-500 rounded-bl-2xl"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, delay: 0.6, repeat: Infinity }}
              className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-blue-500 rounded-br-2xl"
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
              className="text-lg text-blue-600 font-medium"
            >
              {currentAction}
            </motion.p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#0f172a]/70">Movement Analysis</span>
              <span className="text-blue-600 font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isProcessing && (
        <div className="max-w-xl mx-auto">
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-lg text-[#0f172a] font-semibold mb-4">Instructions:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-600 font-semibold">1</span>
                </div>
                <p className="text-sm text-[#0f172a]/70">Keep your face centered in the oval guide</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-600 font-semibold">2</span>
                </div>
                <p className="text-sm text-[#0f172a]/70">Turn your head slowly and smoothly when prompted</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-blue-600 font-semibold">3</span>
                </div>
                <p className="text-sm text-[#0f172a]/70">Follow the arrows - first left, then right</p>
              </div>
            </div>
          </div>

          <button
            onClick={startDetection}
            className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg">Start Head Movement</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </motion.div>
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
  const [bpm, setBpm] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startDetection = async () => {
    setIsProcessing(true);

  await recordAndSendVideo(
    videoRef,
    "http://localhost:5000/api/rppg",
    () => onComplete(),
    setIsProcessing
  );
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
              <span className="text-purple-600 font-semibold">{Math.round(progress)}%</span>
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
      {!isProcessing && (
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
            onClick={startDetection}
            className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Activity className="w-5 h-5" />
            <span className="text-lg">Start Heartbeat Detection</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}

// Sub-step 4: Air Gesture Check
function AirGestureStep({
  onComplete,
  isProcessing,
  setIsProcessing,
}: {
  onComplete: () => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}) {
  const [gestureDetected, setGestureDetected] = useState(false);

  const startDetection = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setGestureDetected(true);
      setIsProcessing(false);
      setTimeout(() => onComplete(), 1000);
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <h3 className="text-3xl text-[#0f172a]">Air Gesture Check</h3>
        <p className="text-lg text-[#0f172a]/60 font-light">
          Make a simple air gesture in front of the camera
        </p>
      </div>

      {/* Large Camera Frame */}
      <div className="max-w-2xl mx-auto">
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-80 h-96">
              <motion.div
                animate={{
                  boxShadow: gestureDetected
                    ? "0 0 0 4px rgba(5, 150, 105, 0.3)"
                    : isProcessing
                    ? "0 0 0 4px rgba(59, 130, 246, 0.3)"
                    : "0 0 0 4px rgba(209, 213, 219, 0.3)",
                }}
                className="absolute inset-0 border-4 border-white rounded-[3rem] overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
                  <Hand className="w-20 h-20 text-gray-400" />
                </div>
              </motion.div>

              {/* Corner indicators */}
              <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-emerald-500 rounded-tl-[3rem]" />
              <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-emerald-500 rounded-tr-[3rem]" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-emerald-500 rounded-bl-[3rem]" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-emerald-500 rounded-br-[3rem]" />

              {/* Scanning animation */}
              {isProcessing && !gestureDetected && (
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-60"
                />
              )}

              {/* Success indicator */}
              {gestureDetected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {!isProcessing && !gestureDetected && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={startDetection}
            className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span className="text-lg">Start Air Gesture Check</span>
          </motion.button>
        )}

        {gestureDetected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <Check className="w-5 h-5" />
              <span>Air gesture detected successfully</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
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