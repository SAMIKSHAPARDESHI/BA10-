import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  Shield,
  Upload,
  Camera,
  Check,
  FileText,
  User,
  Video,
  Mic,
  PenTool,
  Eye,
  ScanLine,
  AlertTriangle,
  Activity,
  Database,
  FileCheck2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

type Step =
  | "input"
  | "liveness"
  | "pan-ocr"
  | "signature"
  | "voice"
  | "fraud"
  | "risk"
  | "decision"
  | "confirm"
  | "storage";

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("input");
  const [progress, setProgress] = useState(10);
  
  // Step completion states
  const [stepData, setStepData] = useState({
    input: { completed: false, video: false, pan: false, voice: false, signature: false },
    liveness: { completed: false, score: 0, blinkDetected: false, movementDetected: false },
    panOcr: { completed: false, extracted: false },
    signature: { completed: false, processed: false },
    voice: { completed: false, transcribed: false },
    fraud: { completed: false, suspicious: false },
    risk: { completed: false, score: 0 },
    decision: { completed: false, status: "" },
    confirm: { completed: false },
    storage: { completed: false },
  });

  const steps = [
    { id: "input", label: "Input", icon: Upload, color: "emerald" },
    { id: "liveness", label: "Liveness", icon: Eye, color: "blue" },
    { id: "pan-ocr", label: "PAN OCR", icon: ScanLine, color: "purple" },
    { id: "signature", label: "Signature", icon: PenTool, color: "amber" },
    { id: "voice", label: "Voice", icon: Mic, color: "pink" },
    { id: "fraud", label: "Fraud Check", icon: AlertTriangle, color: "red" },
    { id: "risk", label: "Risk Score", icon: Activity, color: "indigo" },
    { id: "decision", label: "Decision", icon: CheckCircle2, color: "emerald" },
    { id: "confirm", label: "Confirm", icon: FileCheck2, color: "blue" },
    { id: "storage", label: "Storage", icon: Database, color: "purple" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id as Step);
      setProgress(((nextIndex + 1) / steps.length) * 100);
    } else {
      navigate("/processing");
    }
  };

  const colorClasses: Record<string, string> = {
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600",
    pink: "from-pink-500 to-pink-600",
    red: "from-red-500 to-red-600",
    indigo: "from-indigo-500 to-indigo-600",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5] relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-gray-200/50 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl tracking-tight text-[#0f172a]">SecureKYC</span>
        </div>

        {/* Overall Progress Bar */}
        <div className="flex items-center gap-4">
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "10%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
            />
          </div>
          <span className="text-sm text-[#0f172a]/70 min-w-[3rem]">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Step Navigator */}
          <div className="col-span-3">
            <div className="glass premium-shadow rounded-2xl p-6 sticky top-24">
              <h3 className="text-sm text-[#0f172a]/70 mb-4">Verification Steps</h3>
              <div className="space-y-1">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        isCurrent
                          ? "bg-emerald-50 border border-emerald-200"
                          : isCompleted
                          ? "bg-white/50"
                          : "opacity-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                            : isCurrent
                            ? `bg-gradient-to-br ${colorClasses[step.color]}`
                            : "bg-gray-200"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <Icon className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          isCurrent ? "text-[#0f172a]" : "text-[#0f172a]/60"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-[#0f172a]/60">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>End-to-end encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            <div className="glass premium-shadow-lg rounded-3xl p-10 min-h-[600px]">
              <AnimatePresence mode="wait">
                {/* Step 1: Input Acquisition */}
                {currentStep === "input" && (
                  <InputAcquisitionStep
                    key="input"
                    stepData={stepData.input}
                    onUpdate={(data) =>
                      setStepData({ ...stepData, input: { ...stepData.input, ...data } })
                    }
                    onNext={handleNext}
                  />
                )}

                {/* Step 2: Liveness & Deepfake Check */}
                {currentStep === "liveness" && (
                  <LivenessCheckStep
                    key="liveness"
                    stepData={stepData.liveness}
                    onUpdate={(data) =>
                      setStepData({ ...stepData, liveness: { ...stepData.liveness, ...data } })
                    }
                    onNext={handleNext}
                  />
                )}

                {/* Step 3: PAN OCR Extraction */}
                {currentStep === "pan-ocr" && (
                  <PANOCRStep
                    key="pan-ocr"
                    stepData={stepData.panOcr}
                    onUpdate={(data) =>
                      setStepData({ ...stepData, panOcr: { ...stepData.panOcr, ...data } })
                    }
                    onNext={handleNext}
                  />
                )}

                {/* Step 4: Signature Processing */}
                {currentStep === "signature" && (
                  <SignatureProcessingStep
                    key="signature"
                    stepData={stepData.signature}
                    onUpdate={(data) =>
                      setStepData({ ...stepData, signature: { ...stepData.signature, ...data } })
                    }
                    onNext={handleNext}
                  />
                )}

                {/* Step 5: Voice & NLP Processing */}
                {currentStep === "voice" && (
                  <VoiceProcessingStep
                    key="voice"
                    stepData={stepData.voice}
                    onUpdate={(data) =>
                      setStepData({ ...stepData, voice: { ...stepData.voice, ...data } })
                    }
                    onNext={handleNext}
                  />
                )}

                {/* Step 6: Document Fraud Detection */}
                {currentStep === "fraud" && (
                  <FraudDetectionStep
                    key="fraud"
                    stepData={stepData.fraud}
                    onUpdate={(data) =>
                      setStepData({ ...stepData, fraud: { ...stepData.fraud, ...data } })
                    }
                    onNext={handleNext}
                  />
                )}

                {/* Step 7: Risk Scoring */}
                {currentStep === "risk" && (
                  <RiskScoringStep
                    key="risk"
                    stepData={stepData.risk}
                    onUpdate={(data) =>
                      setStepData({ ...stepData, risk: { ...stepData.risk, ...data } })
                    }
                    onNext={handleNext}
                  />
                )}

                {/* Step 8: Decision Engine */}
                {currentStep === "decision" && (
                  <DecisionEngineStep
                    key="decision"
                    stepData={stepData.decision}
                    riskScore={stepData.risk.score}
                    onUpdate={(data) =>
                      setStepData({ ...stepData, decision: { ...stepData.decision, ...data } })
                    }
                    onNext={handleNext}
                  />
                )}

                {/* Step 9: User Confirmation */}
                {currentStep === "confirm" && (
                  <UserConfirmationStep
                    key="confirm"
                    stepData={stepData.confirm}
                    onUpdate={(data) =>
                      setStepData({ ...stepData, confirm: { ...stepData.confirm, ...data } })
                    }
                    onNext={handleNext}
                  />
                )}

                {/* Step 10: Storage & Logging */}
                {currentStep === "storage" && (
                  <StorageStep
                    key="storage"
                    stepData={stepData.storage}
                    onComplete={() => navigate("/success")}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 1: Input Acquisition
function InputAcquisitionStep({
  stepData,
  onUpdate,
  onNext,
}: {
  stepData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl text-[#0f172a] tracking-tight">Input Acquisition</h2>
            <p className="text-sm text-[#0f172a]/50">Step 1 of 10</p>
          </div>
        </div>
        <p className="text-[#0f172a]/60 font-light">
          Please provide your verification materials. All data is encrypted during transmission.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Video Upload */}
        <label className="cursor-pointer group">
          <input
            type="file"
            accept="video/*"
            onChange={() => onUpdate({ video: true })}
            className="hidden"
          />
          <div
            className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${
              stepData.video
                ? "border-emerald-500 bg-emerald-50/50"
                : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30"
            }`}
          >
            <div className="flex items-center gap-4">
              {stepData.video ? (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors flex-shrink-0">
                  <Video className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
                </div>
              )}
              <div>
                <p className="text-sm text-[#0f172a]">Video Recording</p>
                <p className="text-xs text-[#0f172a]/50 mt-1">
                  {stepData.video ? "Uploaded" : "Click to upload"}
                </p>
              </div>
            </div>
          </div>
        </label>

        {/* PAN Upload */}
        <label className="cursor-pointer group">
          <input
            type="file"
            accept="image/*"
            onChange={() => onUpdate({ pan: true })}
            className="hidden"
          />
          <div
            className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${
              stepData.pan
                ? "border-emerald-500 bg-emerald-50/50"
                : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30"
            }`}
          >
            <div className="flex items-center gap-4">
              {stepData.pan ? (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors flex-shrink-0">
                  <FileText className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
                </div>
              )}
              <div>
                <p className="text-sm text-[#0f172a]">PAN Card</p>
                <p className="text-xs text-[#0f172a]/50 mt-1">
                  {stepData.pan ? "Uploaded" : "Click to upload"}
                </p>
              </div>
            </div>
          </div>
        </label>

        {/* Voice Upload */}
        <label className="cursor-pointer group">
          <input
            type="file"
            accept="audio/*"
            onChange={() => onUpdate({ voice: true })}
            className="hidden"
          />
          <div
            className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${
              stepData.voice
                ? "border-emerald-500 bg-emerald-50/50"
                : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30"
            }`}
          >
            <div className="flex items-center gap-4">
              {stepData.voice ? (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors flex-shrink-0">
                  <Mic className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
                </div>
              )}
              <div>
                <p className="text-sm text-[#0f172a]">Voice Sample</p>
                <p className="text-xs text-[#0f172a]/50 mt-1">
                  {stepData.voice ? "Recorded" : "Click to record"}
                </p>
              </div>
            </div>
          </div>
        </label>

        {/* Signature Upload */}
        <label className="cursor-pointer group">
          <input
            type="file"
            accept="image/*"
            onChange={() => onUpdate({ signature: true })}
            className="hidden"
          />
          <div
            className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${
              stepData.signature
                ? "border-emerald-500 bg-emerald-50/50"
                : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30"
            }`}
          >
            <div className="flex items-center gap-4">
              {stepData.signature ? (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors flex-shrink-0">
                  <PenTool className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
                </div>
              )}
              <div>
                <p className="text-sm text-[#0f172a]">Signature</p>
                <p className="text-xs text-[#0f172a]/50 mt-1">
                  {stepData.signature ? "Captured" : "Click to capture"}
                </p>
              </div>
            </div>
          </div>
        </label>
      </div>

      {/* User Profile */}
      <div className="space-y-4">
        <h3 className="text-lg text-[#0f172a]">Basic Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-emerald-900">Your privacy is protected</p>
            <p className="text-emerald-700/70 mt-1 font-light">
              All files are encrypted with AES-256 and transmitted over secure channels
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => {
            onUpdate({ completed: true });
            onNext();
          }}
          disabled={!stepData.video || !stepData.pan || !stepData.voice || !stepData.signature}
          className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Continue to Liveness Check
        </button>
      </div>
    </motion.div>
  );
}

// Step 2: Liveness & Deepfake Check
function LivenessCheckStep({
  stepData,
  onUpdate,
  onNext,
}: {
  stepData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}) {
  const [isScanning, setIsScanning] = useState(false);
  const [livenessScore, setLivenessScore] = useState(0);

  const startScan = () => {
    setIsScanning(true);
    
    // Simulate blink detection
    setTimeout(() => {
      onUpdate({ blinkDetected: true });
    }, 1000);

    // Simulate movement detection
    setTimeout(() => {
      onUpdate({ movementDetected: true });
    }, 2000);

    // Simulate liveness score calculation
    let score = 0;
    const interval = setInterval(() => {
      score += 5;
      setLivenessScore(score);
      if (score >= 95) {
        clearInterval(interval);
        setIsScanning(false);
        onUpdate({ completed: true, score: 95 });
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl text-[#0f172a] tracking-tight">Liveness & Deepfake Check</h2>
            <p className="text-sm text-[#0f172a]/50">Step 2 of 10</p>
          </div>
        </div>
        <p className="text-[#0f172a]/60 font-light">
          AI is analyzing your video for liveness indicators and deepfake detection
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Video Preview */}
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-64">
                <div className="absolute inset-0 border-4 border-blue-500 rounded-3xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                </div>

                {/* Scanning indicator */}
                {isScanning && (
                  <motion.div
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70"
                  />
                )}
              </div>
            </div>
          </div>

          {!stepData.completed && !isScanning && (
            <button
              onClick={startScan}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start Liveness Scan
            </button>
          )}
        </div>

        {/* Liveness Indicators */}
        <div className="space-y-4">
          {/* Liveness Score */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#0f172a]/70">Liveness Score</span>
              <span className="text-2xl text-[#0f172a]">{livenessScore}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${livenessScore}%` }}
                className={`h-full rounded-full ${
                  livenessScore >= 90
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                    : livenessScore >= 70
                    ? "bg-gradient-to-r from-amber-500 to-amber-600"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                }`}
              />
            </div>
          </div>

          {/* Detection Results */}
          <div className="space-y-3">
            <div
              className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                stepData.blinkDetected
                  ? "bg-emerald-50 border border-emerald-200"
                  : "bg-white/50 border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    stepData.blinkDetected
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                      : "bg-gray-200"
                  }`}
                >
                  {stepData.blinkDetected && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-sm text-[#0f172a]">Blink Detection</span>
              </div>
              {stepData.blinkDetected && (
                <span className="text-xs text-emerald-600">Detected</span>
              )}
            </div>

            <div
              className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                stepData.movementDetected
                  ? "bg-emerald-50 border border-emerald-200"
                  : "bg-white/50 border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    stepData.movementDetected
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                      : "bg-gray-200"
                  }`}
                >
                  {stepData.movementDetected && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-sm text-[#0f172a]">Head Movement</span>
              </div>
              {stepData.movementDetected && (
                <span className="text-xs text-emerald-600">Detected</span>
              )}
            </div>

            <div
              className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                livenessScore >= 90
                  ? "bg-emerald-50 border border-emerald-200"
                  : "bg-white/50 border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    livenessScore >= 90
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                      : "bg-gray-200"
                  }`}
                >
                  {livenessScore >= 90 && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-sm text-[#0f172a]">Heartbeat (rPPG)</span>
              </div>
              {livenessScore >= 90 && (
                <span className="text-xs text-emerald-600">Detected</span>
              )}
            </div>
          </div>

          {/* Deepfake Status */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm text-[#0f172a]">Deepfake Detection</p>
                <p className="text-xs text-[#0f172a]/50 mt-1">
                  {livenessScore >= 90 ? "No manipulation detected" : "Analyzing..."}
                </p>
              </div>
              {livenessScore >= 90 && (
                <Check className="w-5 h-5 text-emerald-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reassuring Message */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-900">Advanced AI protection</p>
            <p className="text-blue-700/70 mt-1 font-light">
              Our system uses cutting-edge deepfake detection to ensure your identity is genuine
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => onNext()}
          disabled={!stepData.completed}
          className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Continue to PAN OCR
        </button>
      </div>
    </motion.div>
  );
}

// Step 3: PAN OCR Extraction
function PANOCRStep({
  stepData,
  onUpdate,
  onNext,
}: {
  stepData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState({
    panNumber: "",
    name: "",
    dob: "",
  });

  const startOCR = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setExtractedData({
        panNumber: "ABCDE1234F",
        name: "RASHI JAMBHALE",
        dob: "01/06/2004",
      });
      onUpdate({ completed: true, extracted: true });
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
            <ScanLine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl text-[#0f172a] tracking-tight">PAN OCR Extraction</h2>
            <p className="text-sm text-[#0f172a]/50">Step 3 of 10</p>
          </div>
        </div>
        <p className="text-[#0f172a]/60 font-light">
          Extracting and validating information from your PAN card
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* PAN Card Preview */}
        <div className="space-y-4">
          <div className="aspect-[1.6/1] bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-24 h-24 text-purple-300" />
            </div>
            
            {isProcessing && (
              <>
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-purple-500/10"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"
                />
              </>
            )}
          </div>

          {!stepData.extracted && !isProcessing && (
            <button
              onClick={startOCR}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start OCR Extraction
            </button>
          )}

          {isProcessing && (
            <div className="text-center text-sm text-[#0f172a]/60">
              <p>Processing multiple frames...</p>
              <p className="text-xs mt-1">Auto-correcting perspective & enhancing quality</p>
            </div>
          )}
        </div>

        {/* Extracted Data */}
        <div className="space-y-4">
          <h3 className="text-lg text-[#0f172a]">Extracted Information</h3>
          
          <div className="space-y-3">
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-[#0f172a]/50 mb-2">PAN Number</p>
              <p className="text-lg text-[#0f172a] font-mono">
                {extractedData.panNumber || "XXXXX0000X"}
              </p>
              {stepData.extracted && (
                <div className="flex items-center gap-2 mt-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-emerald-600">Validated</span>
                </div>
              )}
            </div>

            <div className="glass rounded-xl p-4">
              <p className="text-xs text-[#0f172a]/50 mb-2">Full Name</p>
              <p className="text-lg text-[#0f172a]">
                {extractedData.name || "---"}
              </p>
            </div>

            <div className="glass rounded-xl p-4">
              <p className="text-xs text-[#0f172a]/50 mb-2">Date of Birth</p>
              <p className="text-lg text-[#0f172a]">
                {extractedData.dob || "--/--/----"}
              </p>
            </div>
          </div>

          {stepData.extracted && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-emerald-900">OCR Complete</p>
                  <p className="text-xs text-emerald-700/70 mt-0.5">
                    All fields extracted and validated successfully
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Technical Info */}
      <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-purple-900">Multi-frame processing</p>
            <p className="text-purple-700/70 mt-1 font-light">
              We capture and analyze multiple frames to ensure highest accuracy in text extraction
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => onNext()}
          disabled={!stepData.extracted}
          className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Continue to Signature
        </button>
      </div>
    </motion.div>
  );
}

// Step 4: Signature Processing (Simplified for brevity - similar structure)
function SignatureProcessingStep({
  stepData,
  onUpdate,
  onNext,
}: {
  stepData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
            <PenTool className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl text-[#0f172a] tracking-tight">Signature Processing</h2>
            <p className="text-sm text-[#0f172a]/50">Step 4 of 10</p>
          </div>
        </div>
        <p className="text-[#0f172a]/60 font-light">
          Capturing and enhancing your signature for verification
        </p>
      </div>

      <div className="text-center py-12">
        <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mb-6">
          <PenTool className="w-16 h-16 text-amber-600" />
        </div>
        <p className="text-[#0f172a]/60 mb-6">Signature segmentation and quality enhancement complete</p>
        <button
          onClick={() => {
            onUpdate({ completed: true, processed: true });
            onNext();
          }}
          className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Continue to Voice Processing
        </button>
      </div>
    </motion.div>
  );
}

// Step 5: Voice & NLP Processing (Simplified)
function VoiceProcessingStep({
  stepData,
  onUpdate,
  onNext,
}: {
  stepData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl text-[#0f172a] tracking-tight">Voice & NLP Processing</h2>
            <p className="text-sm text-[#0f172a]/50">Step 5 of 10</p>
          </div>
        </div>
        <p className="text-[#0f172a]/60 font-light">
          Transcribing voice and extracting identity fields with NLP
        </p>
      </div>

      <div className="text-center py-12">
        <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center mb-6">
          <Mic className="w-16 h-16 text-pink-600" />
        </div>
        <p className="text-[#0f172a]/60 mb-6">Voice transcription and speaker verification complete</p>
        <button
          onClick={() => {
            onUpdate({ completed: true, transcribed: true });
            onNext();
          }}
          className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Continue to Fraud Detection
        </button>
      </div>
    </motion.div>
  );
}

// Step 6: Document Fraud Detection
function FraudDetectionStep({
  stepData,
  onUpdate,
  onNext,
}: {
  stepData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}) {
  const [isScanning, setIsScanning] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      onUpdate({ completed: true, suspicious: false });
      setIsScanning(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl text-[#0f172a] tracking-tight">Document Fraud Detection</h2>
            <p className="text-sm text-[#0f172a]/50">Step 6 of 10</p>
          </div>
        </div>
        <p className="text-[#0f172a]/60 font-light">
          Scanning for tampering, inconsistencies, and anomalies
        </p>
      </div>

      <div className="text-center py-12">
        {isScanning ? (
          <div className="space-y-6">
            <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center relative">
              <AlertTriangle className="w-16 h-16 text-red-600" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-2xl"
              />
            </div>
            <p className="text-[#0f172a]/60">Analyzing documents for fraud indicators...</p>
          </div>
        ) : stepData.completed ? (
          <div className="space-y-6">
            <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl text-emerald-600 mb-2">No fraud detected</p>
              <p className="text-sm text-[#0f172a]/60">All documents appear authentic</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-16 h-16 text-red-600" />
            </div>
            <button
              onClick={startScan}
              className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start Fraud Detection
            </button>
          </div>
        )}
      </div>

      {stepData.completed && (
        <div className="flex justify-end pt-4">
          <button
            onClick={() => onNext()}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Continue to Risk Scoring
          </button>
        </div>
      )}
    </motion.div>
  );
}

// Step 7: Risk Scoring
function RiskScoringStep({
  stepData,
  onUpdate,
  onNext,
}: {
  stepData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [score, setScore] = useState(0);

  const calculateRisk = () => {
    setIsCalculating(true);
    let currentScore = 0;
    const targetScore = 15; // Low risk score (0-30 = Approve)

    const interval = setInterval(() => {
      currentScore += 1;
      setScore(currentScore);
      if (currentScore >= targetScore) {
        clearInterval(interval);
        setIsCalculating(false);
        onUpdate({ completed: true, score: targetScore });
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl text-[#0f172a] tracking-tight">Risk Scoring</h2>
            <p className="text-sm text-[#0f172a]/50">Step 7 of 10</p>
          </div>
        </div>
        <p className="text-[#0f172a]/60 font-light">
          Combining all verification factors into a final risk assessment
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Risk Gauge */}
        <div className="space-y-6">
          <div className="aspect-square glass rounded-3xl p-8 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke={
                    score <= 30
                      ? "#10b981"
                      : score <= 60
                      ? "#f59e0b"
                      : "#ef4444"
                  }
                  strokeWidth="12"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "552", strokeDashoffset: "552" }}
                  animate={{
                    strokeDashoffset: 552 - (score / 100) * 552,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl text-[#0f172a]">{score}</div>
                <div className="text-sm text-[#0f172a]/60 mt-2">Risk Score</div>
              </div>
            </div>
          </div>

          {!stepData.completed && !isCalculating && (
            <button
              onClick={calculateRisk}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Calculate Risk Score
            </button>
          )}
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg text-[#0f172a]">Score Components</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 glass rounded-xl">
              <span className="text-sm text-[#0f172a]/70">Liveness Check</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
                </div>
                <span className="text-sm text-emerald-600">95%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 glass rounded-xl">
              <span className="text-sm text-[#0f172a]/70">OCR Accuracy</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
                </div>
                <span className="text-sm text-emerald-600">98%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 glass rounded-xl">
              <span className="text-sm text-[#0f172a]/70">Signature Match</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
                </div>
                <span className="text-sm text-emerald-600">92%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 glass rounded-xl">
              <span className="text-sm text-[#0f172a]/70">Voice Verification</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
                </div>
                <span className="text-sm text-emerald-600">94%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 glass rounded-xl">
              <span className="text-sm text-[#0f172a]/70">Fraud Check</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
                </div>
                <span className="text-sm text-emerald-600">100%</span>
              </div>
            </div>
          </div>

          {stepData.completed && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-emerald-900">Low Risk Profile</p>
                  <p className="text-xs text-emerald-700/70 mt-0.5">
                    All verification factors passed successfully
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Activity className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-indigo-900">Multi-factor risk assessment</p>
            <p className="text-indigo-700/70 mt-1 font-light">
              Score range: 0-30 (Approve) • 31-60 (Manual Review) • 61-100 (Reject)
            </p>
          </div>
        </div>
      </div>

      {stepData.completed && (
        <div className="flex justify-end pt-4">
          <button
            onClick={() => onNext()}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Continue to Decision
          </button>
        </div>
      )}
    </motion.div>
  );
}

// Step 8: Decision Engine
function DecisionEngineStep({
  stepData,
  riskScore,
  onUpdate,
  onNext,
}: {
  stepData: any;
  riskScore: number;
  onUpdate: (data: any) => void;
  onNext: () => void;
}) {
  const decision =
    riskScore <= 30
      ? { status: "approved", label: "Approved", color: "emerald", icon: CheckCircle2 }
      : riskScore <= 60
      ? { status: "review", label: "Manual Review", color: "amber", icon: AlertTriangle }
      : { status: "rejected", label: "Rejected", color: "red", icon: AlertTriangle };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${decision.color}-500 to-${decision.color}-600 flex items-center justify-center shadow-lg`}>
            <decision.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl text-[#0f172a] tracking-tight">Decision Engine</h2>
            <p className="text-sm text-[#0f172a]/50">Step 8 of 10</p>
          </div>
        </div>
        <p className="text-[#0f172a]/60 font-light">
          Final verification decision based on comprehensive risk analysis
        </p>
      </div>

      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className={`w-40 h-40 mx-auto rounded-3xl bg-gradient-to-br from-${decision.color}-100 to-${decision.color}-50 flex items-center justify-center mb-8 shadow-2xl`}
        >
          <decision.icon className={`w-24 h-24 text-${decision.color}-600`} />
        </motion.div>

        <h3 className="text-4xl text-[#0f172a] mb-4">{decision.label}</h3>
        <p className="text-lg text-[#0f172a]/60 mb-2">Risk Score: {riskScore}/100</p>
        
        {decision.status === "approved" && (
          <p className="text-sm text-emerald-600">
            All verification checks passed. User can proceed.
          </p>
        )}
        {decision.status === "review" && (
          <p className="text-sm text-amber-600">
            Some checks require manual review by our team.
          </p>
        )}
        {decision.status === "rejected" && (
          <p className="text-sm text-red-600">
            Verification failed. Please contact support.
          </p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => {
            onUpdate({ completed: true, status: decision.status });
            onNext();
          }}
          className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Continue to Confirmation
        </button>
      </div>
    </motion.div>
  );
}

// Step 9: User Confirmation
function UserConfirmationStep({
  stepData,
  onUpdate,
  onNext,
}: {
  stepData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <FileCheck2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl text-[#0f172a] tracking-tight">Confirm Your Information</h2>
            <p className="text-sm text-[#0f172a]/50">Step 9 of 10</p>
          </div>
        </div>
        <p className="text-[#0f172a]/60 font-light">
          Please review and confirm the extracted information
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm text-[#0f172a]/70">Full Name</label>
            <input
              type="text"
              defaultValue="RASHI JAMBHALE"
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-[#0f172a]/70">PAN Number</label>
            <input
              type="text"
              defaultValue="ABCDE1234F"
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-[#0f172a]/70">Date of Birth</label>
            <input
              type="text"
              defaultValue="01/06/2004"
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-[#0f172a]/70">Email</label>
            <input
              type="email"
              defaultValue="rashi.jambhale@email.com"
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <input type="checkbox" className="mt-1" id="confirm-checkbox" />
          <label htmlFor="confirm-checkbox" className="text-sm text-blue-900">
            I confirm that the information above is accurate and I consent to the processing of my data for verification purposes
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => {
            onUpdate({ completed: true });
            onNext();
          }}
          className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Confirm and Proceed
        </button>
      </div>
    </motion.div>
  );
}

// Step 10: Storage & Logging
function StorageStep({
  stepData,
  onComplete,
}: {
  stepData: any;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl text-[#0f172a] tracking-tight">Storage & Logging</h2>
            <p className="text-sm text-[#0f172a]/50">Step 10 of 10</p>
          </div>
        </div>
        <p className="text-[#0f172a]/60 font-light">
          Securely storing your verified data and generating audit logs
        </p>
      </div>

      <div className="text-center py-12 space-y-8">
        <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center relative overflow-hidden">
          <Database className="w-16 h-16 text-purple-600 z-10" />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: `${100 - progress}%` }}
            className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-purple-400/20"
          />
        </div>

        <div className="space-y-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#0f172a]/70">Progress</span>
              <span className="text-sm text-[#0f172a]">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
              />
            </div>
          </div>

          <p className="text-sm text-[#0f172a]/60">
            {progress < 30 && "Encrypting verification data..."}
            {progress >= 30 && progress < 60 && "Storing in secure database..."}
            {progress >= 60 && progress < 90 && "Generating audit logs..."}
            {progress >= 90 && "Finalizing verification..."}
          </p>
        </div>
      </div>

      <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-purple-900">Secure storage</p>
            <p className="text-purple-700/70 mt-1 font-light">
              Your data is encrypted at rest and complies with industry security standards
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
