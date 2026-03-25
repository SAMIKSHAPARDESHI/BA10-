import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Shield, CreditCard, FileText, Car, Check } from "lucide-react";
import { VerificationLayout } from "./VerificationLayout";

type IDType = "aadhaar" | "pan" | "license" | null;

export function IDSelection() {
  const navigate = useNavigate();
  const [selectedID, setSelectedID] = useState<IDType>(null);

  const idOptions = [
    {
      id: "aadhaar" as IDType,
      label: "Aadhaar Card",
      icon: CreditCard,
      description: "12-digit unique identification",
      color: "emerald",
    },
    {
      id: "pan" as IDType,
      label: "PAN Card",
      icon: FileText,
      description: "Permanent Account Number",
      color: "blue",
    },
    {
      id: "license" as IDType,
      label: "Driving License",
      icon: Car,
      description: "Valid driving license",
      color: "purple",
    },
  ];

  const colorClasses: Record<string, string> = {
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <VerificationLayout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl text-[#0f172a] tracking-tight mb-3">
                Select Government ID
              </h2>
              <p className="text-lg text-[#0f172a]/60 font-light">
                Choose a valid government-issued identification document
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {idOptions.map((option, index) => {
                const Icon = option.icon;
                const isSelected = selectedID === option.id;

                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={() => setSelectedID(option.id)}
                    className={`relative p-8 rounded-3xl transition-all duration-300 ${
                      isSelected
                        ? "glass border-2 border-emerald-500 premium-shadow-lg scale-105"
                        : "glass hover:scale-105 premium-shadow"
                    }`}
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${colorClasses[option.color]} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Label */}
                    <h3 className="text-xl text-[#0f172a] mb-2">{option.label}</h3>
                    <p className="text-sm text-[#0f172a]/60 font-light">
                      {option.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            {/* Information Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass rounded-2xl p-6 mb-8"
            >
              <div className="flex gap-4">
                <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#0f172a] mb-2">Secure document verification</p>
                  <p className="text-sm text-[#0f172a]/60 font-light">
                    Your ID will be securely scanned and verified using AI. We never store raw
                    document images. Only encrypted verification data is retained as per compliance
                    requirements.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={() => navigate("/liveness")}
              disabled={!selectedID}
              className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="text-lg">Continue to Verification</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </VerificationLayout>
  );
}