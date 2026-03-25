import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { CheckCircle2, Download, Home, Shield } from "lucide-react";

export function VerificationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5] relative overflow-hidden flex items-center justify-center">
      {/* Premium background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-green-400/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-10 px-8 max-w-2xl">
        {/* Success Icon with Animation */}
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
              className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl"
            >
              <CheckCircle2 className="w-16 h-16 text-white" />
            </motion.div>

            {/* Success particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: Math.cos((i * Math.PI) / 3) * 100,
                  y: Math.sin((i * Math.PI) / 3) * 100,
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.8 + i * 0.1,
                  ease: "easeOut",
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-emerald-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-5xl text-[#0f172a] tracking-tight">
            Verification complete!
          </h1>
          <p className="text-xl text-[#0f172a]/60 font-light">
            Your identity has been successfully verified
          </p>
        </motion.div>

        {/* Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="glass premium-shadow-lg rounded-3xl p-8"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-[#0f172a]/70">Verification ID</span>
              <span className="text-[#0f172a] font-mono">VRF-2024-{Math.floor(Math.random() * 10000)}</span>
            </div>
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-[#0f172a]/70">Date & Time</span>
              <span className="text-[#0f172a]">
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-[#0f172a]/70">Status</span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Verified
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[#0f172a]/70">Trust Score</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "98%" }}
                    transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                  />
                </div>
                <span className="text-[#0f172a] text-sm">98%</span>
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
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <button className="px-8 py-4 glass rounded-2xl text-[#0f172a] hover:bg-white/90 transition-all duration-300 flex items-center gap-2">
            <Download className="w-5 h-5" />
            <span>Download Certificate</span>
          </button>
        </motion.div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex items-center justify-center gap-2 text-sm text-[#0f172a]/50"
        >
          <Shield className="w-4 h-4" />
          <span>Your data is secured with bank-grade encryption</span>
        </motion.div>
      </div>
    </div>
  );
}
