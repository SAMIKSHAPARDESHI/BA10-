import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Shield, Activity, Check } from "lucide-react";
import { VerificationLayout } from "./VerificationLayout";

export function RiskScoringScreen() {
  const navigate = useNavigate();
  const [isCalculating, setIsCalculating] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const calculateRisk = () => {
    setIsCalculating(true);
    let currentScore = 0;
    const targetScore = 18; // Low risk score (0-30 = Approve)

    const interval = setInterval(() => {
      currentScore += 1;
      setScore(currentScore);
      if (currentScore >= targetScore) {
        clearInterval(interval);
        setIsCalculating(false);
        setIsComplete(true);
      }
    }, 80);
  };

  const getDecision = (riskScore: number) => {
    if (riskScore <= 30) {
      return { label: "Approve", color: "emerald", range: "0-30" };
    } else if (riskScore <= 60) {
      return { label: "Manual Review", color: "amber", range: "31-60" };
    } else {
      return { label: "Reject", color: "red", range: "61-100" };
    }
  };

  const decision = getDecision(score);

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
        <div className="relative z-10 max-w-5xl mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl text-[#0f172a] tracking-tight mb-3">
                Risk Assessment
              </h2>
              <p className="text-lg text-[#0f172a]/60 font-light">
                Comprehensive analysis of all verification factors
              </p>
            </div>

            <div className="glass premium-shadow-lg rounded-3xl p-10">
              <div className="grid grid-cols-2 gap-8">
                {/* Risk Gauge */}
                <div className="space-y-8">
                  <h3 className="text-xl text-[#0f172a] text-center">Risk Score</h3>
                  <div className="aspect-square glass rounded-3xl p-8 flex flex-col items-center justify-center">
                    <div className="relative w-56 h-56">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="112"
                          cy="112"
                          r="100"
                          fill="none"
                          stroke="#f3f4f6"
                          strokeWidth="16"
                        />
                        <motion.circle
                          cx="112"
                          cy="112"
                          r="100"
                          fill="none"
                          stroke={
                            score <= 30
                              ? "#10b981"
                              : score <= 60
                              ? "#f59e0b"
                              : "#ef4444"
                          }
                          strokeWidth="16"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "628", strokeDashoffset: "628" }}
                          animate={{
                            strokeDashoffset: 628 - (score / 100) * 628,
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-6xl text-[#0f172a]">{score}</div>
                        <div className="text-sm text-[#0f172a]/60 mt-2">out of 100</div>
                      </div>
                    </div>
                  </div>

                  {!isCalculating && !isComplete && (
                    <button
                      onClick={calculateRisk}
                      className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Calculate Risk Score
                    </button>
                  )}
                </div>

                {/* Score Breakdown */}
                <div className="space-y-6">
                  <h3 className="text-xl text-[#0f172a]">Score Components</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 glass rounded-xl">
                      <span className="text-sm text-[#0f172a]/70">Liveness Check</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full w-[95%] bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
                        </div>
                        <span className="text-sm text-emerald-600 w-12 text-right">95%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 glass rounded-xl">
                      <span className="text-sm text-[#0f172a]/70">OCR Accuracy</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full w-[98%] bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
                        </div>
                        <span className="text-sm text-emerald-600 w-12 text-right">98%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 glass rounded-xl">
                      <span className="text-sm text-[#0f172a]/70">Signature Match</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full w-[93%] bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
                        </div>
                        <span className="text-sm text-emerald-600 w-12 text-right">93%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 glass rounded-xl">
                      <span className="text-sm text-[#0f172a]/70">Fraud Check</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
                        </div>
                        <span className="text-sm text-emerald-600 w-12 text-right">100%</span>
                      </div>
                    </div>
                  </div>

                  {/* Decision Box */}
                  {isComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-8 p-6 bg-${decision.color}-50 border border-${decision.color}-200 rounded-2xl`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Check className={`w-6 h-6 text-${decision.color}-600`} />
                        <h4 className={`text-lg text-${decision.color}-900`}>Decision: {decision.label}</h4>
                      </div>
                      <p className={`text-sm text-${decision.color}-700/70 font-light mb-4`}>
                        Risk score range: {decision.range}
                      </p>
                      <div className="space-y-2 text-xs text-[#0f172a]/60">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-gradient-to-br from-emerald-500 to-emerald-600" />
                          <span>0-30: Approve (Low Risk)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-gradient-to-br from-amber-500 to-amber-600" />
                          <span>31-60: Manual Review (Medium Risk)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-gradient-to-br from-red-500 to-red-600" />
                          <span>61-100: Reject (High Risk)</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-8 bg-indigo-50/50 border border-indigo-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <Activity className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-indigo-900">Multi-factor risk assessment</p>
                    <p className="text-indigo-700/70 mt-1 font-light">
                      Combining liveness, OCR, signature, and fraud detection scores into a comprehensive risk profile
                    </p>
                  </div>
                </div>
              </div>

              {isComplete && (
                <button
                  onClick={() => navigate("/confirmation")}
                  className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Continue to Confirmation
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </VerificationLayout>
  );
}