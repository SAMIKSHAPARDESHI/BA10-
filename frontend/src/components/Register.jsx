import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Shield, Mail, Lock, Eye, EyeOff, Smartphone, ArrowRight, CheckCircle2, AlertCircle, KeyRound, FileText, Home, UserPlus } from "lucide-react";

export function LoginConsent() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState("auth");
  const [authMode, setAuthMode] = useState("register");
  
  // Login/Register state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authErrors, setAuthErrors] = useState({});
  const [authComplete, setAuthComplete] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Consent state
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToDataSharing, setAgreedToDataSharing] = useState(false);
  const [consentErrors, setConsentErrors] = useState({});

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Handle email change
  const handleEmailChange = (value) => {
    setEmail(value);
    if (authErrors.email) {
      if (validateEmail(value)) {
        const newErrors = { ...authErrors };
        delete newErrors.email;
        setAuthErrors(newErrors);
      }
    }
  };

  // Handle password change
  const handlePasswordChange = (value) => {
    setPassword(value);
    if (authErrors.password) {
      if (validatePassword(value)) {
        const newErrors = { ...authErrors };
        delete newErrors.password;
        setAuthErrors(newErrors);
      }
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (authErrors.confirmPassword) {
      if (value === password) {
        const newErrors = { ...authErrors };
        delete newErrors.confirmPassword;
        setAuthErrors(newErrors);
      }
    }
  };

const API = "http://localhost:5000/api";

const handleAuth = async () => {
  const errors = {};

  if (!email) {
    errors.email = "Email address is required";
  } else if (!validateEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (!validatePassword(password)) {
    errors.password = "Password must be at least 8 characters";
  }

  if (authMode === "register") {
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  if (Object.keys(errors).length > 0) {
    setAuthErrors(errors);
    return;
  }

  try {
    const endpoint = authMode === "register" ? "/register" : "/login";
    console.log("Calling API:", `${API}${endpoint}`);
    const res = await fetch(`${API}${endpoint}`,  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        ...(authMode === "register" && {
          name: email.split("@")[0],
        }),
      }),
    });

    const data = await res.json();
    console.log("Response from backend:", data);

    if (data.message === "Registration successful") {
      setRegistrationSuccess(true);
      setTimeout(() => {
        setAuthMode("login");
        setRegistrationSuccess(false);
      }, 2000);
    } else if (data.message === "Login successful") {
      localStorage.setItem("userId", data.userId);
      setAuthComplete(true);

      setTimeout(() => {
        setCurrentSection("consent");
      }, 800);
    } else {
      setAuthErrors({ email: data.message });
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};
  const handleConsentSubmit = () => {
    const errors = {};

    if (!agreedToTerms) {
      errors.terms = "You must agree to the Terms of Service";
    }
    if (!agreedToPrivacy) {
      errors.privacy = "You must agree to the Privacy Policy";
    }
    if (!agreedToDataSharing) {
      errors.dataSharing = "You must consent to data processing";
    }

    if (Object.keys(errors).length > 0) {
      setConsentErrors(errors);
      return;
    }

    setConsentErrors({});
    navigate("/liveness");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            delay: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <div className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-gray-200/50 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl tracking-tight text-[#0f172a]">SecureKYC</span>
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <Home className="w-4 h-4 text-[#0f172a]/60" />
          <span className="text-sm text-[#0f172a]/80">Home</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-5rem)] flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {/* Auth Section */}
            {currentSection === "auth" && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="glass premium-shadow-lg rounded-3xl p-12"
              >
                {/* Auth Header */}
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl"
                  >
                    <Shield className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-4xl text-[#0f172a] tracking-tight mb-3">
                    {authMode === "login" ? "Welcome Back" : "Register"}
                  </h1>
                  <p className="text-lg text-[#0f172a]/60 font-light">
                    {authMode === "login" ? "Sign in to continue your secure KYC verification" : "Create a new account to start your KYC verification"}
                  </p>
                </div>

                {/* Auth Form */}
                <div className="space-y-6 max-w-md mx-auto">
                  {/* Registration Success Message */}
                  {registrationSuccess && !authComplete && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-emerald-800">Registration Successful!</p>
                        <p className="text-xs text-emerald-600 mt-0.5">Please login to continue...</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm text-[#0f172a]/70 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f172a]/40 pointer-events-none" />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="          you@example.com"
                        className={`w-full pl-12 pr-4 py-3.5 bg-white border ${
                          authErrors.email ? "border-red-300" : "border-gray-200"
                        } rounded-xl focus:outline-none focus:ring-2 ${
                          authErrors.email ? "focus:ring-red-500" : "focus:ring-emerald-500"
                        } focus:border-transparent transition-all`}
                      />
                    </div>
                    {authErrors.email && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 mt-2 text-red-600 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{authErrors.email}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm text-[#0f172a]/70 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f172a]/40" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        placeholder="          Enter your password"
                        className={`w-full left-8 pl-12 pr-12 py-3.5 bg-white border ${
                          authErrors.password ? "border-red-300" : "border-gray-200"
                        } rounded-xl focus:outline-none focus:ring-2 ${
                          authErrors.password ? "focus:ring-red-500" : "focus:ring-emerald-500"
                        } focus:border-transparent transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0f172a]/40 hover:text-[#0f172a]/60 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {authErrors.password && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 mt-2 text-red-600 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{authErrors.password}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  {authMode === "register" && (
                    <div>
                      <label className="block text-sm text-[#0f172a]/70 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f172a]/40" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                          placeholder="          Confirm your password"
                          className={`w-full pl-12 pr-12 py-3.5 bg-white border ${
                            authErrors.confirmPassword ? "border-red-300" : "border-gray-200"
                          } rounded-xl focus:outline-none focus:ring-2 ${
                            authErrors.confirmPassword ? "focus:ring-red-500" : "focus:ring-emerald-500"
                          } focus:border-transparent transition-all`}
                        />
                        <button
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0f172a]/40 hover:text-[#0f172a]/60 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {authErrors.confirmPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1.5 mt-2 text-red-600 text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>{authErrors.confirmPassword}</span>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Auth Button */}
                  <button
                    onClick={handleAuth}
                    disabled={authComplete}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl premium-shadow hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {authComplete ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-lg">Auth Successful</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">Continue to Consent</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Alternative Auth Methods */}
                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-sm text-[#0f172a]/50">Or continue with</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <span className="text-sm">OTP</span>
                    </button>
                    <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      <span className="text-sm">SSO</span>
                    </button>
                  </div>
                </div>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 text-sm text-[#0f172a]/50 mt-8">
                  <Shield className="w-4 h-4" />
                  <span>Your data is encrypted and secure</span>
                </div>

                {/* Toggle Login/Register */}
                <div className="text-center mt-6">
                  <p className="text-sm text-[#0f172a]/60">
                    {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                      onClick={() => {
                        setAuthMode(authMode === "login" ? "register" : "login");
                        setAuthErrors({});
                        setRegistrationSuccess(false);
                        setAuthComplete(false);
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");
                      }}
                      className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                    >
                      {authMode === "login" ? "Register here" : "Login here"}
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Consent Section */}
            {currentSection === "consent" && (
              <motion.div
                key="consent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="glass premium-shadow-lg rounded-3xl p-12"
              >
                {/* Consent Header */}
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl"
                  >
                    <FileText className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-4xl text-[#0f172a] tracking-tight mb-3">
                    Consent & Permissions
                  </h1>
                  <p className="text-lg text-[#0f172a]/60 font-light">
                    Review and accept our terms to proceed with KYC verification
                  </p>
                </div>

                {/* Consent Cards */}
                <div className="space-y-4 max-w-2xl mx-auto mb-8">
                  {/* Terms of Service */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`p-6 bg-white rounded-2xl border ${
                      consentErrors.terms ? "border-red-300" : "border-gray-200"
                    } hover:border-emerald-300 transition-all`}
                  >
                    <label className="flex items-start gap-4 cursor-pointer">
                      <div className="relative flex-shrink-0 mt-1">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => {
                            setAgreedToTerms(e.target.checked);
                            if (e.target.checked && consentErrors.terms) {
                              const newErrors = { ...consentErrors };
                              delete newErrors.terms;
                              setConsentErrors(newErrors);
                            }
                          }}
                          className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-5 h-5 text-emerald-600" />
                          <span className="font-medium text-[#0f172a]">Terms of Service</span>
                        </div>
                        <p className="text-sm text-[#0f172a]/60 leading-relaxed">
                          I agree to the Terms of Service and understand the KYC verification process,
                          including identity verification and document validation procedures.
                        </p>
                      </div>
                    </label>
                    {consentErrors.terms && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 mt-3 text-red-600 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{consentErrors.terms}</span>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Privacy Policy */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`p-6 bg-white rounded-2xl border ${
                      consentErrors.privacy ? "border-red-300" : "border-gray-200"
                    } hover:border-emerald-300 transition-all`}
                  >
                    <label className="flex items-start gap-4 cursor-pointer">
                      <div className="relative flex-shrink-0 mt-1">
                        <input
                          type="checkbox"
                          checked={agreedToPrivacy}
                          onChange={(e) => {
                            setAgreedToPrivacy(e.target.checked);
                            if (e.target.checked && consentErrors.privacy) {
                              const newErrors = { ...consentErrors };
                              delete newErrors.privacy;
                              setConsentErrors(newErrors);
                            }
                          }}
                          className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-[#0f172a]">Privacy Policy</span>
                        </div>
                        <p className="text-sm text-[#0f172a]/60 leading-relaxed">
                          I acknowledge the Privacy Policy and consent to the collection, processing,
                          and storage of my personal information in accordance with applicable data protection laws.
                        </p>
                      </div>
                    </label>
                    {consentErrors.privacy && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 mt-3 text-red-600 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{consentErrors.privacy}</span>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Data Sharing */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`p-6 bg-white rounded-2xl border ${
                      consentErrors.dataSharing ? "border-red-300" : "border-gray-200"
                    } hover:border-emerald-300 transition-all`}
                  >
                    <label className="flex items-start gap-4 cursor-pointer">
                      <div className="relative flex-shrink-0 mt-1">
                        <input
                          type="checkbox"
                          checked={agreedToDataSharing}
                          onChange={(e) => {
                            setAgreedToDataSharing(e.target.checked);
                            if (e.target.checked && consentErrors.dataSharing) {
                              const newErrors = { ...consentErrors };
                              delete newErrors.dataSharing;
                              setConsentErrors(newErrors);
                            }
                          }}
                          className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-[#0f172a]">Data Processing Consent</span>
                        </div>
                        <p className="text-sm text-[#0f172a]/60 leading-relaxed">
                          I consent to the processing of my biometric data, documents, and personal information
                          for KYC verification purposes, and understand my rights regarding data access and deletion.
                        </p>
                      </div>
                    </label>
                    {consentErrors.dataSharing && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 mt-3 text-red-600 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{consentErrors.dataSharing}</span>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 max-w-2xl mx-auto">
                  <button
                    onClick={() => setCurrentSection("auth")}
                    className="px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Back to Auth
                  </button>
                  <button
                    onClick={handleConsentSubmit}
                    className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl premium-shadow hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">Start KYC Verification</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 text-sm text-[#0f172a]/50 mt-8">
                  <Shield className="w-4 h-4" />
                  <span>All consent information is securely encrypted</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
