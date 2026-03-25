import { useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Shield, Sparkles, Zap } from "lucide-react";

export function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
  const processKYC = async () => {
    try {
      // STEP 1: SAVE KYC DATA
      await fetch("http://localhost:5000/api/kyc/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),

          name: localStorage.getItem("name"),
          dob: localStorage.getItem("dob"),
          address: localStorage.getItem("address"),

          panNumber: localStorage.getItem("pan"),

          faceMatchScore: 85,
          signatureMatchScore: 80,
          livenessStatus: true,
        }),
      });

      // STEP 2: DECISION ENGINE
      const res = await fetch("http://localhost:5000/api/kyc/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faceMatchScore: 85,
          signatureMatchScore: 80,
          livenessStatus: true,
        }),
      });

      const data = await res.json();

      // STEP 3: NAVIGATION (keep your animation delay)
      setTimeout(() => {
        if (data.status === "Approved") {
          navigate("/success");
        } else if (data.status === "Rejected") {
          navigate("/failure");
        } else {
          navigate("/review");
        }
      }, 4000);

    } catch (err) {
      console.error(err);
      navigate("/failure");
    }
  };

  processKYC();
}, [navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5] relative overflow-hidden flex items-center justify-center">
      {/* Premium background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            delay: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-12 px-8">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 p-1"
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Shield className="w-16 h-16 text-emerald-600" />
              </div>
            </motion.div>

            {/* Orbiting particles */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-500 rounded-full shadow-lg" />
            </motion.div>
            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-lg" />
            </motion.div>
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0"
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-purple-500 rounded-full shadow-lg" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-4xl text-[#0f172a] tracking-tight">
            Verifying securely with AI
          </h1>
          <p className="text-lg text-[#0f172a]/60 font-light max-w-md mx-auto">
            Our advanced algorithms are validating your documents and identity
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="glass premium-shadow-lg rounded-2xl p-8 max-w-md mx-auto"
        >
          <div className="space-y-4">
            <ProcessingStep
              icon={Sparkles}
              label="Analyzing documents"
              delay={0}
              duration={1.5}
            />
            <ProcessingStep
              icon={Shield}
              label="Verifying identity"
              delay={1.5}
              duration={1.5}
            />
            <ProcessingStep
              icon={Zap}
              label="Finalizing verification"
              delay={3}
              duration={1}
            />
          </div>
        </motion.div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex items-center justify-center gap-2 text-sm text-[#0f172a]/50"
        >
          <Shield className="w-4 h-4" />
          <span>Encrypted and secure processing</span>
        </motion.div>
      </div>
    </div>
  );
}

function ProcessingStep({
  icon: Icon,
  label,
  delay,
  duration,
}: {
  icon: React.ElementType;
  label: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center gap-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: [0.8, 1.1, 1] }}
        transition={{ delay, duration: 0.5 }}
        className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg"
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>
      <div className="flex-1 text-left">
        <p className="text-sm text-[#0f172a]">{label}</p>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay, duration, ease: "easeInOut" }}
          className="mt-2 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
        />
      </div>
    </motion.div>
  );
}
