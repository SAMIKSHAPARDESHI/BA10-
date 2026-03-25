import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

// Define the verification flow order
const VERIFICATION_FLOW = [
  "/login",
  "/liveness",
  "/pan-ocr",
  "/signature",
  "/voice-form",
  "/fraud-detection",
  "/risk-scoring",
  "/confirmation",
  "/success"
];

export function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const currentIndex = VERIFICATION_FLOW.indexOf(location.pathname);
    
    if (currentIndex > 0) {
      // Go to previous step in the flow
      navigate(VERIFICATION_FLOW[currentIndex - 1]);
    } else {
      // If at first step or not in flow, go to home
      navigate("/");
    }
  };

  // Don't show back button on home page or welcome page
  if (location.pathname === "/" || location.pathname === "/welcome") {
    return null;
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleBack}
      className="fixed top-8 right-8 z-50 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200 group flex items-center gap-2"
      title="Go back to previous step"
    >
      <ArrowLeft className="w-4 h-4 text-[#0f172a]/60 group-hover:text-emerald-600 group-hover:-translate-x-0.5 transition-all" />
      <span className="text-sm text-[#0f172a]/80 group-hover:text-emerald-600 transition-colors">
        Back
      </span>
    </motion.button>
  );
}