import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { XCircle, RotateCcw, MessageCircle, Shield } from "lucide-react";

export function VerificationFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5] relative overflow-hidden flex items-center justify-center">
      {/* Premium background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-orange-400/15 to-red-400/15 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-10 px-8 max-w-2xl">
        {/* Failure Icon with Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-2xl"
            >
              <XCircle className="w-16 h-16 text-white" />
            </motion.div>

            {/* Warning particles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 2,
                  delay: 0.8 + i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute inset-0 rounded-full border-4 border-red-400"
              />
            ))}
          </div>
        </motion.div>

        {/* Failure Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-5xl text-[#0f172a] tracking-tight">
            Verification incomplete
          </h1>
          <p className="text-xl text-[#0f172a]/60 font-light">
            We couldn't complete your verification at this time
          </p>
        </motion.div>

        {/* Reasons Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="glass premium-shadow-lg rounded-3xl p-8"
        >
          <div className="space-y-6">
            <div className="text-left space-y-4">
              <h3 className="text-lg text-[#0f172a]">Possible reasons:</h3>
              <ul className="space-y-3 text-[#0f172a]/70">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span>Document image quality was too low or blurry</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span>Face verification couldn't match with document photo</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span>Information on document was unclear or incomplete</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span>Technical issue during processing</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-left">
                    <p className="text-blue-900">Don't worry</p>
                    <p className="text-blue-700/70 mt-1 font-light">
                      Your data remains secure. You can retry verification or contact support for assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retry Verification</span>
          </button>

          <button className="px-8 py-4 glass rounded-2xl text-[#0f172a] hover:bg-white/90 transition-all duration-300 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>Contact Support</span>
          </button>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-sm text-[#0f172a]/50"
        >
          <p>Need help? Our support team is available 24/7</p>
        </motion.div>
      </div>
    </div>
  );
}