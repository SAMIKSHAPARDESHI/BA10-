import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Shield, PenTool, Check } from "lucide-react";
import { VerificationLayout } from "./VerificationLayout";
import { BackButton } from "./BackButton";

export function SignatureScreen() {
  const navigate = useNavigate();
  const [signatureCaptured, setSignatureCaptured] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [progress, setProgress] = useState(0);

  const handleCapture = () => {
    setIsProcessing(true);
    setProgress(0);
    let currentProgress = 0;

    const actions = [
      "Capturing signature...",
      "Analyzing stroke patterns...",
      "Segmenting signature from background...",
      "Enhancing image quality...",
      "Verifying signature authenticity...",
      "Signature processing complete!"
    ];

    let actionIndex = 0;
    setCurrentAction(actions[actionIndex]);

    const progressInterval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress >= 20 && actionIndex === 0) {
        actionIndex++;
        setCurrentAction(actions[actionIndex]);
      } else if (currentProgress >= 40 && actionIndex === 1) {
        actionIndex++;
        setCurrentAction(actions[actionIndex]);
      } else if (currentProgress >= 60 && actionIndex === 2) {
        actionIndex++;
        setCurrentAction(actions[actionIndex]);
      } else if (currentProgress >= 80 && actionIndex === 3) {
        actionIndex++;
        setCurrentAction(actions[actionIndex]);
      } else if (currentProgress >= 100) {
        clearInterval(progressInterval);
        actionIndex = 5;
        setCurrentAction(actions[actionIndex]);
        setTimeout(() => {
          setSignatureCaptured(true);
          setIsProcessing(false);
        }, 500);
      }
    }, 50);
  };

  return (
    <VerificationLayout>
      <BackButton />
      <div className="min-h-screen relative overflow-hidden">
        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <PenTool className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl text-[#0f172a] tracking-tight mb-3">
                Signature Capture
              </h2>
              <p className="text-lg text-[#0f172a]/60 font-light">
                Draw or upload your signature for verification
              </p>
            </div>

            <div className="glass premium-shadow-lg rounded-3xl p-10 space-y-8">
              {/* Signature Canvas */}
              <div className="space-y-4">
                <h3 className="text-lg text-[#0f172a]">Draw Your Signature</h3>
                <div className="aspect-[2/1] bg-white border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center hover:border-amber-400 transition-colors cursor-pointer">
                  {!signatureCaptured ? (
                    <div className="text-center">
                      <PenTool className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-[#0f172a]/60">Click to draw or upload signature</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl text-[#0f172a] font-signature mb-2">
                        Rashi Jambhale
                      </div>
                      <div className="flex items-center justify-center gap-2 text-emerald-600">
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Signature captured</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                {!signatureCaptured && !isProcessing ? (
                  <>
                    <button
                      onClick={handleCapture}
                      className="flex-1 px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Capture Signature
                    </button>
                    <label className="flex-1 px-6 py-3.5 glass rounded-xl text-[#0f172a] hover:bg-white/90 transition-all duration-300 cursor-pointer flex items-center justify-center">
                      <input type="file" accept="image/*" className="hidden" onChange={handleCapture} />
                      Upload Image
                    </label>
                  </>
                ) : signatureCaptured && !isProcessing ? (
                  <button
                    onClick={() => setSignatureCaptured(false)}
                    className="flex-1 px-6 py-3.5 glass rounded-xl text-[#0f172a] hover:bg-white/90 transition-all duration-300"
                  >
                    Retake Signature
                  </button>
                ) : null}
              </div>

              {/* Processing Status */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <motion.p
                      key={currentAction}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg text-amber-600 font-medium"
                    >
                      {currentAction}
                    </motion.p>
                  </div>

                  {/* Progress Bar */}
                  <div className="max-w-xl mx-auto space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#0f172a]/70">Processing Signature</span>
                      <span className="text-amber-600 font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Processing Info */}
              {signatureCaptured && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 glass rounded-xl">
                      <Check className="w-5 h-5 text-emerald-600 mb-2" />
                      <p className="text-sm text-[#0f172a]/70">Segmentation Complete</p>
                    </div>
                    <div className="p-4 glass rounded-xl">
                      <Check className="w-5 h-5 text-emerald-600 mb-2" />
                      <p className="text-sm text-[#0f172a]/70">Quality Enhanced</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/voice-form")}
                    className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    Continue to Voice Form Filling
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </VerificationLayout>
  );
}