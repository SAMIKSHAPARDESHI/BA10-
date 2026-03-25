import { motion } from "motion/react";
import { Shield, Sparkles, Lock, Zap, ArrowRight, ScanFace, CheckCircle2, Eye, Fingerprint, Globe, TrendingUp, Hexagon } from "lucide-react";
import { useNavigate } from "react-router";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1321] to-[#0a0f1e] relative overflow-hidden">
      {/* Enhanced animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient orbs with improved animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-gradient-to-br from-emerald-500/40 via-teal-500/30 to-cyan-500/40 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 10, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-gradient-to-br from-blue-600/30 via-indigo-500/30 to-purple-500/40 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 7, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[50%] w-[600px] h-[600px] bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-pink-500/30 rounded-full blur-3xl"
        />
        
        {/* Enhanced grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,black,transparent)]"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              y: [0, -100, -200],
              x: [0, Math.random() * 100 - 50, Math.random() * 200 - 100]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              delay: Math.random() * 5,
              repeat: Infinity 
            }}
            className="absolute w-1 h-1 bg-emerald-400/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 md:px-12 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 flex items-center justify-center shadow-2xl border border-emerald-400/30">
              <Shield className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-emerald-50 to-teal-100 bg-clip-text text-transparent drop-shadow-lg">SecureKYC</span>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105"
        >
          Admin Dashboard
        </motion.button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 backdrop-blur-xl"
          >
            <div className="relative">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div className="absolute inset-0 blur-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <span className="text-sm font-medium bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Next-Gen AI Verification
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                Secure{" "}
              </span>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                E-KYC
              </span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed font-light"
            >
              AI-powered identity verification platform with{" "}
              <span className="text-emerald-400 font-medium">real-time fraud detection</span>
              {" "}and automated compliance
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => navigate('/login')}
              className="group relative px-10 py-5 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-transform group-hover:scale-105 duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 text-white font-semibold text-lg">
                <span>Start Verification</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center justify-center gap-12 pt-12 flex-wrap"
          >
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">99.9%</div>
              <div className="text-sm text-white/50 mt-1">Accuracy</div>
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">&lt;60s</div>
              <div className="text-sm text-white/50 mt-1">Verification</div>
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">24/7</div>
              <div className="text-sm text-white/50 mt-1">Availability</div>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Card 1 */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all duration-500 backdrop-blur-xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-transparent rounded-2xl transition-all duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center mb-4">
                <ScanFace className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Liveness Detection</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Advanced biometric verification with multi-factor liveness checks
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-blue-500/30 transition-all duration-500 backdrop-blur-xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent rounded-2xl transition-all duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">OCR Extraction</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Intelligent document scanning with instant data extraction
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all duration-500 backdrop-blur-xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-transparent rounded-2xl transition-all duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Fraud Prevention</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Real-time deepfake detection and document authenticity verification
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-pink-500/30 transition-all duration-500 backdrop-blur-xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/0 group-hover:from-pink-500/10 group-hover:to-transparent rounded-2xl transition-all duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Risk Scoring</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                AI-driven risk assessment with automated compliance reporting
              </p>
            </div>
          </div>
        </motion.div>

        {/* Process Flow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-20 relative"
        >
          <div className="relative rounded-3xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-2xl p-10 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Verification in{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    3 Simple Steps
                  </span>
                </h2>
                <p className="text-white/60">Complete your identity verification in under 60 seconds</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold border-4 border-[#0a0f1e] shadow-xl">
                    1
                  </div>
                  <div className="pt-8 text-center">
                    <div className="inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 items-center justify-center mb-4">
                      <Fingerprint className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Upload Document</h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      Securely submit your PAN card for instant verification
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold border-4 border-[#0a0f1e] shadow-xl">
                    2
                  </div>
                  <div className="pt-8 text-center">
                    <div className="inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 items-center justify-center mb-4">
                      <ScanFace className="w-10 h-10 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Verify Identity</h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      Complete liveness check with facial biometric verification
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold border-4 border-[#0a0f1e] shadow-xl">
                    3
                  </div>
                  <div className="pt-8 text-center">
                    <div className="inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Get Verified</h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      Receive instant approval with automated compliance certification
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-white/40 text-sm mb-6">Trusted by leading enterprises worldwide</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-emerald-400 inline mr-2" />
              <span className="text-white/70 text-sm">SOC 2 Certified</span>
            </div>
            <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Lock className="w-5 h-5 text-blue-400 inline mr-2" />
              <span className="text-white/70 text-sm">GDPR Compliant</span>
            </div>
            <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Globe className="w-5 h-5 text-purple-400 inline mr-2" />
              <span className="text-white/70 text-sm">ISO 27001</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-10 px-6">
        <div className="h-px w-full max-w-4xl mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>
        <p className="text-white/30 text-sm">
          © 2026 SecureKYC. Enterprise-grade identity verification platform.
        </p>
      </div>
    </div>
  );
}