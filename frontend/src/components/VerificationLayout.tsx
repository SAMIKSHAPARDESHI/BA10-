import { ReactNode } from "react";
import { motion } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { Shield, CheckCircle2, Circle, Home, ArrowLeft, ChevronRight } from "lucide-react";
import { getStepProgress } from "../utils/progressHelper";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  percentage: number;
  substeps?: string[];
}

const verificationSteps: Step[] = [
  {
    id: "login",
    title: "Login & Consent",
    description: "Secure authentication",
    icon: Shield,
    path: "/login",
    percentage: 12.5,
  },
  {
    id: "liveness",
    title: "Liveness Check",
    description: "Verify you're real",
    icon: Shield,
    path: "/liveness",
    percentage: 25,
    substeps: ["Blink Detection", "Head Turn", "Heartbeat", "Air Gesture Check"]
  },
  {
    id: "pan-ocr",
    title: "PAN Extraction",
    description: "OCR processing",
    icon: Shield,
    path: "/pan-ocr",
    percentage: 37.5,
  },
  {
    id: "signature",
    title: "Signature",
    description: "Sign digitally",
    icon: Shield,
    path: "/signature",
    percentage: 50,
  },
  {
    id: "voice-form",
    title: "Voice Form Filling",
    description: "Answer via voice",
    icon: Shield,
    path: "/voice-form",
    percentage: 62.5,
  },
  {
    id: "fraud-detection",
    title: "Fraud Detection",
    description: "Document verification",
    icon: Shield,
    path: "/fraud-detection",
    percentage: 75,
  },
  {
    id: "risk-scoring",
    title: "Risk Scoring",
    description: "AI analysis",
    icon: Shield,
    path: "/risk-scoring",
    percentage: 87.5,
  },
  {
    id: "confirmation",
    title: "Confirmation",
    description: "Review & submit",
    icon: CheckCircle2,
    path: "/confirmation",
    percentage: 100,
  },
];

interface VerificationLayoutProps {
  children: ReactNode;
  currentStep?: string;
}

export function VerificationLayout({ children, currentStep }: VerificationLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine the current step based on the path
  const currentPath = location.pathname;
  const activeStepIndex = verificationSteps.findIndex(step => step.path === currentPath);
  const activeStep = verificationSteps[activeStepIndex];
  
  // Calculate overall progress using the helper function
  const progressData = getStepProgress(currentPath);
  const overallProgress = progressData.percentage;

  const getStepStatus = (index: number) => {
    if (index < activeStepIndex) return "completed";
    if (index === activeStepIndex) return "active";
    return "upcoming";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5]">
        {/* Left Sidebar - Enhanced Premium Design */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-80 flex-shrink-0 bg-white border-r border-gray-200/80 shadow-2xl relative overflow-hidden"
        >
          {/* Elegant background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/30 pointer-events-none" />
          
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-200/50 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold tracking-tight text-[#0f172a]">SecureKYC</span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="p-2.5 rounded-xl hover:bg-emerald-50 transition-all duration-200 group"
                title="Go to Home"
              >
                <Home className="w-5 h-5 text-[#0f172a]/60 group-hover:text-emerald-600 transition-colors" />
              </button>
            </motion.div>
            
            {/* Overall Progress Section */}
            {activeStep && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[#0f172a]/60 font-light">
                    Step {activeStepIndex + 1} of {verificationSteps.length}
                  </p>
                  <span className="text-sm font-bold text-emerald-600">
                    {overallProgress}%
                  </span>
                </div>
                
                {/* Single Overall Progress Bar */}
                <div className="h-2 rounded-full overflow-hidden bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/30"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="p-6 space-y-4 overflow-y-auto h-[calc(100vh-180px)] relative z-10">
            {verificationSteps.map((step, index) => {
              const isActive = step.path === currentPath;
              const isCompleted = index < activeStepIndex;
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative"
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.02 : 1,
                    }}
                    className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30"
                        : isCompleted
                        ? "bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-md"
                        : "bg-white/80 hover:bg-gray-50 hover:shadow-md border border-gray-200/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isActive
                            ? "bg-white/20"
                            : isCompleted
                            ? "bg-emerald-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Icon
                            className={`w-5 h-5 ${
                              isActive ? "text-white" : "text-[#0f172a]/70"
                            }`}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-sm font-semibold transition-colors ${
                            isActive ? "text-white" : "text-[#0f172a]"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`text-xs transition-colors ${
                            isActive ? "text-white/80" : "text-[#0f172a]/60"
                          }`}
                        >
                          {step.description}
                        </p>

                        {/* Substeps */}
                        {step.substeps && step.substeps.length > 0 && (
                          <div className="mt-3 space-y-1.5">
                            {step.substeps.map((substep, subIndex) => (
                              <div
                                key={subIndex}
                                className="flex items-center gap-2"
                              >
                                <Circle
                                  className={`w-1.5 h-1.5 ${
                                    isActive || isCompleted
                                      ? "text-white fill-white"
                                      : "text-[#0f172a]/30"
                                  }`}
                                />
                                <span
                                  className={`text-xs ${
                                    isActive ? "text-white/70" : "text-[#0f172a]/50"
                                  }`}
                                >
                                  {substep}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Chevron */}
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-white flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>

                  {/* Connecting line */}
                  {index < verificationSteps.length - 1 && (
                    <div className="absolute left-9 top-[4.5rem] w-0.5 h-4 bg-gradient-to-b from-emerald-300 via-teal-300 to-transparent" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm z-10">
            <div className="flex items-center gap-2 text-xs text-[#0f172a]/50">
              <Shield className="w-3.5 h-3.5" />
              <span>Secured by 256-bit encryption</span>
            </div>
          </div>
        </motion.div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}