import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Shield, FileText, Lock, CheckCircle2, ArrowRight, Home, AlertCircle } from "lucide-react";
import { VerificationLayout } from "./VerificationLayout";
import { BackButton } from "./BackButton";

export function Consent() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);
  const [biometricConsent, setBiometricConsent] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = () => {
    // Validation: All consents must be given
    if (!accepted) {
      setError("You must accept the Terms & Conditions to continue");
      return;
    }
    if (!dataConsent) {
      setError("You must consent to data collection to continue");
      return;
    }
    if (!biometricConsent) {
      setError("You must consent to biometric data collection to continue");
      return;
    }

    setError("");
    navigate("/liveness");
  };

  return (
    <VerificationLayout>
      <BackButton />
      <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5] relative overflow-hidden">
        {/* Premium background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        </div>

        {/* Home Button */}
        <div className="absolute top-8 right-8 z-20">
          <button
            onClick={() => navigate('/')}
            className="p-3 rounded-xl glass hover:bg-white/80 transition-all duration-200 group premium-shadow"
            title="Go to Home"
          >
            <Home className="w-5 h-5 text-[#0f172a]/60 group-hover:text-emerald-600 transition-colors" />
          </button>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl text-[#0f172a] tracking-tight mb-3">
                Consent & Instructions
              </h2>
              <p className="text-lg text-[#0f172a]/60 font-light">
                Please review and accept our terms to continue
              </p>
            </div>

            <div className="glass premium-shadow-lg rounded-3xl p-10 space-y-8">
              {/* Verification Process Overview */}
              <div className="space-y-4">
                <h3 className="text-xl text-[#0f172a]">How verification works</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">1</span>
                    </div>
                    <div>
                      <p className="text-[#0f172a]">Provide your PAN card</p>
                      <p className="text-sm text-[#0f172a]/60 mt-1 font-light">
                        We'll scan and verify your PAN card details
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">2</span>
                    </div>
                    <div>
                      <p className="text-[#0f172a]">Complete liveness verification</p>
                      <p className="text-sm text-[#0f172a]/60 mt-1 font-light">
                        Simple face verification to confirm you're a real person
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">3</span>
                    </div>
                    <div>
                      <p className="text-[#0f172a]">AI-powered validation</p>
                      <p className="text-sm text-[#0f172a]/60 mt-1 font-light">
                        Our secure system validates your identity in seconds
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Privacy */}
              <div className="space-y-4">
                <h3 className="text-xl text-[#0f172a]">Terms & Privacy</h3>
                <div className="bg-white/50 rounded-2xl p-6 max-h-64 overflow-y-auto border border-gray-200">
                  <div className="space-y-4 text-sm text-[#0f172a]/70 font-light leading-relaxed">
                    <p>
                      By continuing, you consent to the collection, processing, and storage of your personal information for identity verification purposes.
                    </p>
                    <p>
                      <strong className="text-[#0f172a]">Data Collection:</strong> We collect your name, government ID details, biometric data (facial recognition), signature, and related verification information.
                    </p>
                    <p>
                      <strong className="text-[#0f172a]">Data Usage:</strong> Your data will be used solely for verification purposes and will not be shared with third parties without your explicit consent.
                    </p>
                    <p>
                      <strong className="text-[#0f172a]">Data Security:</strong> All information is encrypted using industry-standard protocols (AES-256) and stored securely in compliance with data protection regulations.
                    </p>
                    <p>
                      <strong className="text-[#0f172a]">Data Retention:</strong> Verification records are retained as per regulatory requirements and can be deleted upon request.
                    </p>
                    <p>
                      <strong className="text-[#0f172a]">Your Rights:</strong> You have the right to access, correct, or delete your data at any time by contacting our support team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                  <Lock className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs text-emerald-900">Bank-Grade Encryption</p>
                </div>
                <div className="text-center p-4 bg-blue-50/50 border border-blue-200 rounded-xl">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-blue-900">Privacy Protected</p>
                </div>
                <div className="text-center p-4 bg-purple-50/50 border border-purple-200 rounded-xl">
                  <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-purple-900">Compliance Certified</p>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-6 border-t border-gray-200">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="w-6 h-6 rounded-lg border-2 border-gray-300 checked:bg-gradient-to-br checked:from-emerald-500 checked:to-emerald-600 checked:border-emerald-500 transition-all appearance-none cursor-pointer"
                    />
                    {accepted && (
                      <CheckCircle2 className="w-6 h-6 text-white absolute pointer-events-none" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#0f172a] group-hover:text-emerald-600 transition-colors">
                      I have read and accept the Terms & Conditions and Privacy Policy
                    </p>
                    <p className="text-sm text-[#0f172a]/60 mt-1 font-light">
                      I consent to the processing of my personal data for verification purposes
                    </p>
                  </div>
                </label>
              </div>

              {/* Data Consent Checkbox */}
              <div className="pt-6 border-t border-gray-200">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      checked={dataConsent}
                      onChange={(e) => setDataConsent(e.target.checked)}
                      className="w-6 h-6 rounded-lg border-2 border-gray-300 checked:bg-gradient-to-br checked:from-emerald-500 checked:to-emerald-600 checked:border-emerald-500 transition-all appearance-none cursor-pointer"
                    />
                    {dataConsent && (
                      <CheckCircle2 className="w-6 h-6 text-white absolute pointer-events-none" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#0f172a] group-hover:text-emerald-600 transition-colors">
                      I consent to the collection of my personal data
                    </p>
                    <p className="text-sm text-[#0f172a]/60 mt-1 font-light">
                      This includes my name, government ID details, and related verification information
                    </p>
                  </div>
                </label>
              </div>

              {/* Biometric Consent Checkbox */}
              <div className="pt-6 border-t border-gray-200">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      checked={biometricConsent}
                      onChange={(e) => setBiometricConsent(e.target.checked)}
                      className="w-6 h-6 rounded-lg border-2 border-gray-300 checked:bg-gradient-to-br checked:from-emerald-500 checked:to-emerald-600 checked:border-emerald-500 transition-all appearance-none cursor-pointer"
                    />
                    {biometricConsent && (
                      <CheckCircle2 className="w-6 h-6 text-white absolute pointer-events-none" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#0f172a] group-hover:text-emerald-600 transition-colors">
                      I consent to the collection of my biometric data
                    </p>
                    <p className="text-sm text-[#0f172a]/60 mt-1 font-light">
                      This includes facial recognition data
                    </p>
                  </div>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="pt-4">
                  <p className="text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <span className="text-lg">Start Secure Verification</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </VerificationLayout>
  );
}