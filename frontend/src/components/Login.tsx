import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Shield, Mail, Lock, Eye, EyeOff, Smartphone, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";
import { VerificationLayout } from "./VerificationLayout";
import { BackButton } from "./BackButton";

export function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<"email" | "mobile" | "otp">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation Rules
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*]/.test(password)) return "Password must contain at least one special character";
    return "";
  };

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^[+]?[(]?[0-9]{1,3}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
    if (!mobile) return "Mobile number is required";
    const digitsOnly = mobile.replace(/\D/g, '');
    if (digitsOnly.length < 10) return "Mobile number must be at least 10 digits";
    if (digitsOnly.length > 15) return "Mobile number is too long";
    if (!mobileRegex.test(mobile)) return "Invalid mobile number format";
    return "";
  };

  const validateOTP = (otp: string) => {
    if (!otp) return "OTP is required";
    if (otp.length !== 6) return "OTP must be 6 digits";
    if (!/^\d+$/.test(otp)) return "OTP must contain only numbers";
    return "";
  };

  const API = "http://localhost:5000/api";

const handleLogin = async () => {
  const newErrors: { [key: string]: string } = {};

  if (loginMethod === "email") {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  try {
    // 🔥 CALL BACKEND LOGIN API
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    // ✅ LOGIN SUCCESS
    if (data.message === "Login successful") {
      localStorage.setItem("userId", data.userId);

      setIsLoggedIn(true);

      setTimeout(() => {
        navigate("/consent");
      }, 1500);
    } 
    // ❌ ERROR
    else {
      setErrors({ email: data.message });
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  return (
    <VerificationLayout>
      <BackButton />
      <div className="relative z-10 flex items-center justify-center px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass premium-shadow-lg rounded-3xl p-10 w-full max-w-md"
        >
          {!isLoggedIn ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl text-[#0f172a] tracking-tight mb-2">
                  Welcome back
                </h2>
                <p className="text-[#0f172a]/60 font-light">
                  Sign in to continue your verification
                </p>
              </div>

              {/* Login Method Selector */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setLoginMethod("email")}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                    loginMethod === "email"
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg"
                      : "bg-white/50 text-[#0f172a]/70 hover:bg-white/80"
                  }`}
                >
                  <Mail className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => setLoginMethod("mobile")}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                    loginMethod === "mobile"
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg"
                      : "bg-white/50 text-[#0f172a]/70 hover:bg-white/80"
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => setLoginMethod("otp")}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                    loginMethod === "otp"
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg"
                      : "bg-white/50 text-[#0f172a]/70 hover:bg-white/80"
                  }`}
                >
                  <KeyRound className="w-4 h-4 mx-auto" />
                </button>
              </div>

              {/* Login Forms */}
              <div className="space-y-5">
                {loginMethod === "email" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block mb-2 text-sm text-[#0f172a]/80">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3.5 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-[#0f172a]/80">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3.5 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                  </motion.div>
                )}

                {loginMethod === "mobile" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block mb-2 text-sm text-[#0f172a]/80">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3.5 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                      {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                    </div>
                  </motion.div>
                )}

                {loginMethod === "otp" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block mb-2 text-sm text-[#0f172a]/80">
                        One-Time Password
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className="w-full px-4 py-3.5 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-center tracking-widest"
                      />
                      {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Security Note */}
              <div className="mt-6 bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-emerald-900">Secure login</p>
                    <p className="text-emerald-700/70 mt-1 font-light">
                      Your credentials are encrypted and never stored
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={
                  (loginMethod === "email" && !email) ||
                  (loginMethod === "mobile" && !mobile) ||
                  (loginMethod === "otp" && otp.length !== 6)
                }
                className="w-full mt-6 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl premium-shadow hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <span>Sign In Securely</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl text-[#0f172a] mb-2">Login Successful</h3>
              <p className="text-[#0f172a]/60 font-light">Redirecting to verification...</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </VerificationLayout>
  );
}