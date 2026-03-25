import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Shield, AlertTriangle, CheckCircle2, ScanEye, Lock, ArrowRight } from "lucide-react";
import { VerificationLayout } from "./VerificationLayout";

export function FraudDetectionScreen() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentCheck, setCurrentCheck] = useState("");

  const checks = [
    "Analyzing document metadata",
    "Detecting digital tampering",
    "Validating watermarks",
    "Checking font consistency",
    "Verifying security features"
  ];

  useEffect(() => {
    if (isScanning) {
      let progress = 0;
      let checkIndex = 0;
      
      const progressInterval = setInterval(() => {
        progress += 2;
        setScanProgress(progress);
        
        if (progress % 20 === 0 && checkIndex < checks.length) {
          setCurrentCheck(checks[checkIndex]);
          checkIndex++;
        }
        
        if (progress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsComplete(true);
            setIsScanning(false);
          }, 500);
        }
      }, 50);
      
      return () => clearInterval(progressInterval);
    }
  }, [isScanning]);

  return (
    <VerificationLayout>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5]">
        {/* Premium background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-3xl"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-red-500 via-orange-600 to-red-600 items-center justify-center shadow-2xl shadow-red-500/40"
              >
                <ScanEye className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-5xl text-[#0f172a] tracking-tight mb-4">
                Document Fraud Detection
              </h2>
              <p className="text-xl text-[#0f172a]/60 font-light max-w-2xl mx-auto">
                AI-powered forensic analysis for tampering, forgery, and anomaly detection
              </p>
            </div>

            <div className="glass premium-shadow-2xl rounded-3xl p-12 border border-white/50">
              <AnimatePresence mode="wait">
                {isScanning ? (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-10 py-12"
                  >
                    {/* Scanning Animation */}
                    <div className="relative w-40 h-40 mx-auto">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center"
                      >
                        <ScanEye className="w-20 h-20 text-red-600" />
                      </motion.div>
                      
                      {/* Rotating border */}
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-transparent border-t-red-500 border-r-orange-500 rounded-2xl"
                      />
                      
                      {/* Pulse effect */}
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl bg-red-500/20"
                      />
                    </div>

                    {/* Progress Information */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl text-[#0f172a] mb-4">Analyzing documents...</h3>
                        <p className="text-sm text-[#0f172a]/60 font-medium">{currentCheck}</p>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#0f172a]/70">Detection Progress</span>
                          <span className="text-red-600 font-semibold">{scanProgress}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: `${scanProgress}%` }}
                            className="h-full bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Checks List */}
                      <div className="grid grid-cols-1 gap-3 max-w-md mx-auto mt-8">
                        {checks.map((check, index) => {
                          const isChecked = scanProgress > index * 20;
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: isChecked ? 1 : 0.3, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`flex items-center gap-3 text-sm ${isChecked ? 'text-[#0f172a]' : 'text-[#0f172a]/40'}`}
                            >
                              {isChecked ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                              )}
                              <span>{check}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ) : isComplete ? (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="space-y-10 py-12"
                  >
                    {/* Success Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-40 h-40 mx-auto rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center border-4 border-emerald-200 shadow-xl"
                    >
                      <CheckCircle2 className="w-24 h-24 text-emerald-600" />
                    </motion.div>
                    
                    <div className="space-y-4">
                      <h3 className="text-4xl text-emerald-600 font-semibold">No Fraud Detected</h3>
                      <p className="text-xl text-[#0f172a]/60 font-light max-w-xl mx-auto">
                        All documents verified as authentic with zero anomalies detected
                      </p>
                    </div>

                    {/* Detection Results Grid */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-10">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl shadow-sm"
                      >
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        </div>
                        <p className="text-sm font-semibold text-emerald-900 mb-1">No Tampering</p>
                        <p className="text-xs text-emerald-700/70">Original document</p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl shadow-sm"
                      >
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        </div>
                        <p className="text-sm font-semibold text-emerald-900 mb-1">Authentic</p>
                        <p className="text-xs text-emerald-700/70">Verified genuine</p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl shadow-sm"
                      >
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        </div>
                        <p className="text-sm font-semibold text-emerald-900 mb-1">Consistent</p>
                        <p className="text-xs text-emerald-700/70">Data matches</p>
                      </motion.div>
                    </div>

                    {/* Continue Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      onClick={() => navigate("/risk-scoring")}
                      className="mt-10 px-12 py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 group"
                    >
                      <span className="text-xl">Continue to Risk Scoring</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-10 py-12"
                  >
                    <div className="w-40 h-40 mx-auto rounded-3xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center border-2 border-red-200/50 shadow-lg">
                      <AlertTriangle className="w-20 h-20 text-red-600" />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-3xl text-[#0f172a] font-semibold">Ready to Scan</h3>
                      <p className="text-lg text-[#0f172a]/60 font-light max-w-xl mx-auto">
                        Advanced AI forensics will analyze all submitted documents for authenticity
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setIsScanning(true)}
                      className="px-12 py-5 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 group"
                    >
                      <ScanEye className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="text-xl">Start Fraud Detection</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Security Note */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200/60 rounded-2xl p-6"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-blue-900 font-semibold mb-1">Bank-Grade Security</p>
                    <p className="text-sm text-blue-700/80 font-light leading-relaxed">
                      All fraud checks are performed with military-grade encryption and complete privacy protection
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </VerificationLayout>
  );
}