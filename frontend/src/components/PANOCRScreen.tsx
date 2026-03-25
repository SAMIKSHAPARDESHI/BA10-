import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Shield, ScanLine, Check, Sparkles, Camera, ArrowRight, AlertCircle } from "lucide-react";
import { VerificationLayout } from "./VerificationLayout";
import { BackButton } from "./BackButton";

export function PANOCRScreen() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState({
    panNumber: "",
    name: "",
    dob: "",
    fatherName: "",
    motherName: "",
  });
  const [isComplete, setIsComplete] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation Rules for PAN Card
  const validatePAN = (pan: string) => {
    // PAN Format: AAAAA0000A (5 letters, 4 digits, 1 letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!pan) return "PAN number is required";
    if (!panRegex.test(pan)) return "Invalid PAN format. Must be: AAAAA0000A";
    // Fourth character should be 'P' for individual
    if (pan[3] !== 'P') return "PAN must be for an individual (4th character must be 'P')";
    return "";
  };

  const validateName = (name: string) => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (!/^[A-Z\s]+$/.test(name)) return "Name must contain only capital letters";
    return "";
  };

  const validateDOB = (dob: string) => {
    if (!dob) return "Date of birth is required";
    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
    if (!dobRegex.test(dob)) return "Invalid date format. Use DD/MM/YYYY";
    
    // Check if date is valid
    const [day, month, year] = dob.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return "Invalid date";
    }
    
    // Check if person is at least 18 years old
    const today = new Date();
    const age = today.getFullYear() - year - (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day) ? 1 : 0);
    if (age < 18) return "Must be at least 18 years old";
    if (age > 120) return "Invalid age";
    
    return "";
  };

  const validateFatherName = (name: string) => {
    if (!name) return "Father's name is required";
    if (name.length < 2) return "Father's name must be at least 2 characters";
    if (!/^[A-Z\s]+$/.test(name)) return "Father's name must contain only capital letters";
    return "";
  };

  const validateMotherName = (name: string) => {
    if (!name) return "Mother's name is required";
    if (name.length < 2) return "Mother's name must be at least 2 characters";
    if (!/^[A-Z\s]+$/.test(name)) return "Mother's name must contain only capital letters";
    return "";
  };

  const startOCR = () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setErrors({});
    
    // Simulate progressive OCR processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    
    setTimeout(() => {
      clearInterval(interval);
      setExtractedData({
        panNumber: "ABCPK1234L",
        name: "RASHI JAMBHALE",
        dob: "01/06/2004",
        fatherName: "DATTATRAYA JAMBHALE",
        motherName: "DIPIKA JAMBHALE",
      });
      setIsComplete(true);
      setIsProcessing(false);
    }, 3500);
  };

  const handleContinue = () => {
    const newErrors: { [key: string]: string } = {};

    const panError = validatePAN(extractedData.panNumber);
    const nameError = validateName(extractedData.name);
    const dobError = validateDOB(extractedData.dob);
    const fatherNameError = validateFatherName(extractedData.fatherName);
    const motherNameError = validateMotherName(extractedData.motherName);

    if (panError) newErrors.panNumber = panError;
    if (nameError) newErrors.name = nameError;
    if (dobError) newErrors.dob = dobError;
    if (fatherNameError) newErrors.fatherName = fatherNameError;
    if (motherNameError) newErrors.motherName = motherNameError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigate("/signature");
    }
  };

  return (
    <VerificationLayout>
      <BackButton />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5]">
        {/* Premium background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
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
                className="inline-flex w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 items-center justify-center shadow-2xl shadow-purple-500/40"
              >
                <ScanLine className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-5xl text-[#0f172a] tracking-tight mb-4">
                PAN Card Verification
              </h2>
              <p className="text-xl text-[#0f172a]/60 font-light max-w-2xl mx-auto">
                Advanced OCR extraction with AI-powered auto-correction and real-time validation
              </p>
            </div>

            <div className="glass premium-shadow-2xl rounded-3xl p-12 border border-white/50">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* PAN Card Preview */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl text-[#0f172a] font-semibold">Document Scan</h3>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                      <Camera className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-purple-600 font-medium">Live Capture</span>
                    </div>
                  </div>
                  
                  <div className="aspect-[1.6/1] bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-8 relative overflow-hidden border-2 border-purple-200/50 shadow-inner">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ScanLine className="w-32 h-32 text-purple-200" />
                    </div>

                    {isProcessing && (
                      <>
                        <motion.div
                          animate={{ opacity: [0.2, 0.6, 0.2] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10"
                        />
                        <motion.div
                          initial={{ y: "0%" }}
                          animate={{ y: "100%" }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-80"
                        />
                        
                        {/* Corner scanning indicators */}
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-purple-500 rounded-tl-xl"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                          className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-purple-500 rounded-tr-xl"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                          className="absolute bottom-4 left-4 w-12 h-12 border-l-4 border-b-4 border-purple-500 rounded-bl-xl"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                          className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 border-purple-500 rounded-br-xl"
                        />
                      </>
                    )}
                    
                    {isComplete && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 backdrop-blur-sm"
                      >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl">
                          <Check className="w-12 h-12 text-white" />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#0f172a]/70">Processing frames...</span>
                        <span className="text-purple-600 font-semibold">{processingProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${processingProgress}%` }}
                          className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-full"
                        />
                      </div>
                      <p className="text-xs text-[#0f172a]/50 text-center">
                        Auto-correcting perspective & enhancing quality
                      </p>
                    </motion.div>
                  )}

                  {!isProcessing && !isComplete && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={startOCR}
                      className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-lg">Start OCR Extraction</span>
                    </motion.button>
                  )}
                </div>

                {/* Extracted Data */}
                <div className="space-y-6">
                  <h3 className="text-xl text-[#0f172a] font-semibold mb-6">Extracted Information</h3>

                  <AnimatePresence mode="wait">
                    <motion.div className="space-y-4">
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <p className="text-xs text-[#0f172a]/50 mb-2 uppercase tracking-wide">PAN Number</p>
                        <p className="text-2xl text-[#0f172a] font-mono font-semibold tracking-wider">
                          {extractedData.panNumber || "XXXXX0000X"}
                        </p>
                        {isComplete && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 mt-3 pt-3 border-t border-emerald-200"
                          >
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs text-emerald-600 font-medium">Format validated & verified</span>
                          </motion.div>
                        )}
                        {errors.panNumber && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 mt-3 pt-3 border-t border-red-200"
                          >
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">{errors.panNumber}</span>
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <p className="text-xs text-[#0f172a]/50 mb-2 uppercase tracking-wide">Full Name</p>
                        <p className="text-xl text-[#0f172a] font-semibold">
                          {extractedData.name || "---"}
                        </p>
                        {errors.name && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 mt-3 pt-3 border-t border-red-200"
                          >
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">{errors.name}</span>
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <p className="text-xs text-[#0f172a]/50 mb-2 uppercase tracking-wide">Date of Birth</p>
                        <p className="text-xl text-[#0f172a] font-semibold">
                          {extractedData.dob || "--/--/----"}
                        </p>
                        {errors.dob && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 mt-3 pt-3 border-t border-red-200"
                          >
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">{errors.dob}</span>
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <p className="text-xs text-[#0f172a]/50 mb-2 uppercase tracking-wide">Father's Name</p>
                        <p className="text-xl text-[#0f172a] font-semibold">
                          {extractedData.fatherName || "---"}
                        </p>
                        {errors.fatherName && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 mt-3 pt-3 border-t border-red-200"
                          >
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">{errors.fatherName}</span>
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <p className="text-xs text-[#0f172a]/50 mb-2 uppercase tracking-wide">Mother's Name</p>
                        <p className="text-xl text-[#0f172a] font-semibold">
                          {extractedData.motherName || "---"}
                        </p>
                        {errors.motherName && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 mt-3 pt-3 border-t border-red-200"
                          >
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">{errors.motherName}</span>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>

                  {isComplete && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6 p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm text-emerald-900 font-semibold">OCR Complete</p>
                          <p className="text-xs text-emerald-700/80 mt-1">
                            All fields validated with 99.8% confidence score
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Technical Info */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200/60 rounded-2xl p-6"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-purple-900 font-semibold mb-1">AI-Powered Multi-Frame Processing</p>
                    <p className="text-sm text-purple-700/80 font-light leading-relaxed">
                      Analyzing multiple angles with automated perspective correction, glare removal, and edge enhancement for maximum accuracy
                    </p>
                  </div>
                </div>
              </motion.div>

              {isComplete && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={handleContinue}
                  className="w-full mt-10 px-8 py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  <span className="text-xl">Continue to Signature</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </VerificationLayout>
  );
}