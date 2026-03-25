import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Shield, FileCheck2, Check } from "lucide-react";
import { VerificationLayout } from "./VerificationLayout";

export function UserConfirmationScreen() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "RASHI JAMBHALE",
    panNumber: "ABCDE1234F",
    dob: "01/06/2004",
    email: "rashi.jambhale@email.com",
  });

  return (
    <VerificationLayout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Premium background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="relative z-10 px-8 py-6 flex items-center gap-2 border-b border-gray-200/50 bg-white/30 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl tracking-tight text-[#0f172a]">SecureKYC</span>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <FileCheck2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl text-[#0f172a] tracking-tight mb-3">
                Confirm Your Information
              </h2>
              <p className="text-lg text-[#0f172a]/60 font-light">
                Review and verify all extracted data before finalizing
              </p>
            </div>

            <div className="glass premium-shadow-lg rounded-3xl p-10 space-y-8">
              {/* Verification Summary */}
              <div className="space-y-4">
                <h3 className="text-lg text-[#0f172a]">Verification Summary</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <Check className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs text-emerald-900">Liveness</p>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <Check className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs text-emerald-900">PAN OCR</p>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <Check className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs text-emerald-900">Signature</p>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <Check className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs text-emerald-900">Fraud Check</p>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-5">
                <h3 className="text-lg text-[#0f172a]">Personal Information</h3>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 text-sm text-[#0f172a]/70">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3.5 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-[#0f172a]/70">PAN Number</label>
                    <input
                      type="text"
                      value={formData.panNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, panNumber: e.target.value })
                      }
                      className="w-full px-4 py-3.5 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-[#0f172a]/70">Date of Birth</label>
                    <input
                      type="text"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                      className="w-full px-4 py-3.5 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-[#0f172a]/70">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3.5 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-6 border-t border-gray-200">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-6 h-6 rounded-lg border-2 border-gray-300 checked:bg-gradient-to-br checked:from-emerald-500 checked:to-emerald-600 checked:border-emerald-500 transition-all appearance-none cursor-pointer"
                    />
                    {agreed && (
                      <Check className="w-6 h-6 text-white absolute pointer-events-none" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#0f172a] group-hover:text-blue-600 transition-colors">
                      I confirm that the information above is accurate and complete
                    </p>
                    <p className="text-sm text-[#0f172a]/60 mt-1 font-light">
                      I authorize the processing and storage of this data for verification purposes
                    </p>
                  </div>
                </label>
              </div>

              {/* Security Note */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-blue-900">Final verification step</p>
                    <p className="text-blue-700/70 mt-1 font-light">
                      Your data will be securely stored and encrypted after confirmation
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => navigate("/success")}
                disabled={!agreed}
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="text-lg">Finalize Verification</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </VerificationLayout>
  );
}