import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Mic, MicOff, Volume2, CheckCircle2, ArrowRight, Edit3, Save } from "lucide-react";
import { VerificationLayout } from "./VerificationLayout";
import { BackButton } from "./BackButton";

interface Question {
  id: string;
  question: string;
  field: string;
  placeholder: string;
}

const questions: Question[] = [
  {
    id: "1",
    question: "What is your full name?",
    field: "fullName",
    placeholder: "John Doe"
  },
  {
    id: "2",
    question: "What is your mother's name?",
    field: "motherName",
    placeholder: "Jane Doe"
  },
  {
    id: "3",
    question: "What is your date of birth in day, month, year format?",
    field: "dateOfBirth",
    placeholder: "01/06/2004"
  },
  {
    id: "4",
    question: "What is your address?",
    field: "address",
    placeholder: "301, Gajalaxmi society, Hanuman Nagar, S.B road, Pune 411016"
  },
  {
    id: "5",
    question: "What is your father's name?",
    field: "fatherName",
    placeholder: "Dattatraya Jambhale"
  }
];

export function VoiceFormFilling() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [speakingQuestion, setSpeakingQuestion] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Ready to start");

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Simulate voice question reading
  const speakQuestion = (question: string) => {
    setSpeakingQuestion(true);
    setCurrentStatus("Speaking question...");
    // Simulate speech duration
    setTimeout(() => {
      setSpeakingQuestion(false);
      setCurrentStatus("Listening for your answer");
    }, 2000);
  };

  useEffect(() => {
    if (currentQuestion && !isComplete) {
      speakQuestion(currentQuestion.question);
    }
  }, [currentQuestionIndex]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setCurrentStatus("Listening to your voice...");
    // Simulate recording for 3 seconds
    setTimeout(() => {
      handleStopRecording();
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsProcessingAudio(true);
    setCurrentStatus("Processing audio...");
    
    setTimeout(() => {
      setCurrentStatus("Converting speech to text...");
      
      setTimeout(() => {
        // Safety check for currentQuestion
        if (!currentQuestion) return;
        
        // Simulate voice-to-text conversion with mock data
        const mockAnswers: Record<string, string> = {
          fullName: "Rashi Jambhale",
          motherName: "Savita Jambhale",
          dateOfBirth: "01/06/2004",
          address: "301, Gajalaxmi society, Hanuman Nagar, S.B road, Pune 411016",
          fatherName: "Dattatraya Jambhale"
        };

        setFormData(prev => ({
          ...prev,
          [currentQuestion.field]: mockAnswers[currentQuestion.field]
        }));
        
        setIsProcessingAudio(false);
        setCurrentStatus("Answer captured successfully!");

        // Move to next question after a brief delay
        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
          } else {
            setIsComplete(true);
          }
        }, 1000);
      }, 2000);
    }, 2000);
  };

  const handleEditField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirmAndContinue = () => {
    navigate("/fraud-detection");
  };

  return (
    <VerificationLayout>
      <BackButton />
      <div className="relative z-10 max-w-5xl mx-auto px-8 py-12">
        {!isComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 items-center justify-center shadow-2xl shadow-purple-500/40"
              >
                <Mic className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-5xl text-[#0f172a] tracking-tight mb-4 font-bold">
                Voice Form Filling
              </h2>
              <p className="text-xl text-[#0f172a]/60 font-light max-w-2xl mx-auto">
                Answer questions naturally using your voice for seamless data capture
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#0f172a]/60">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="text-sm text-emerald-600 font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full"
                />
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="glass premium-shadow-lg rounded-3xl p-12"
                >
                  {/* Speaker Icon for Question */}
                  <div className="text-center mb-8">
                    <motion.div
                      animate={speakingQuestion ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.5, repeat: speakingQuestion ? Infinity : 0 }}
                      className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center mb-4 shadow-lg"
                    >
                      <Volume2 className={`w-8 h-8 text-white ${speakingQuestion ? 'animate-pulse' : ''}`} />
                    </motion.div>
                    <h3 className="text-2xl text-[#0f172a] mb-2">{currentQuestion.question}</h3>
                    <p className="text-sm text-[#0f172a]/50 font-light">Tap the microphone and speak your answer</p>
                  </div>

                  {/* Current Status Label */}
                  {(isRecording || isProcessingAudio || speakingQuestion) && (
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-sm text-blue-700 font-medium">{currentStatus}</span>
                      </motion.div>
                    </div>
                  )}

                  {/* Processing Progress Bar */}
                  {isProcessingAudio && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 max-w-md mx-auto"
                    >
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                          className="h-full w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Recording Interface */}
                  <div className="flex flex-col items-center space-y-6">
                    {/* Microphone Button */}
                    <button
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                      disabled={speakingQuestion || isProcessingAudio}
                      className={`relative w-32 h-32 rounded-full transition-all duration-300 ${
                        isRecording
                          ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl scale-110'
                          : 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl hover:scale-105'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isRecording && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-red-400"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                      {isRecording ? (
                        <MicOff className="w-12 h-12 text-white relative z-10 mx-auto" />
                      ) : (
                        <Mic className="w-12 h-12 text-white relative z-10 mx-auto" />
                      )}
                    </button>

                    {/* Status Text */}
                    <div className="text-center">
                      {isRecording ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-2"
                        >
                          <p className="text-lg text-red-600 font-medium">Recording...</p>
                          <div className="flex items-center justify-center gap-1">
                            <motion.div
                              className="w-2 h-2 bg-red-500 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-red-500 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-red-500 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                        </motion.div>
                      ) : formData[currentQuestion.field] ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-2"
                        >
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                          <p className="text-emerald-600 font-medium">Answer recorded!</p>
                          <p className="text-sm text-[#0f172a]/60 bg-white/80 rounded-xl px-4 py-2 max-w-md">
                            "{formData[currentQuestion.field]}"
                          </p>
                        </motion.div>
                      ) : (
                        <p className="text-[#0f172a]/60">
                          {speakingQuestion ? 'Listening to question...' : 'Tap to start recording'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Skip Button */}
                  {!formData[currentQuestion.field] && !isRecording && !speakingQuestion && !isProcessingAudio && (
                    <div className="text-center mt-8">
                      <button
                        onClick={() => {
                          if (currentQuestionIndex < questions.length - 1) {
                            setCurrentQuestionIndex(prev => prev + 1);
                          } else {
                            setIsComplete(true);
                          }
                        }}
                        className="text-sm text-[#0f172a]/50 hover:text-emerald-600 transition-colors"
                      >
                        Skip this question
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl text-[#0f172a] tracking-tight mb-3">
                Review Your Information
              </h2>
              <p className="text-lg text-[#0f172a]/60 font-light">
                Please confirm or edit your details below
              </p>
            </div>

            <div className="glass premium-shadow-lg rounded-3xl p-10 space-y-6">
              {questions.map((q) => (
                <div key={q.id} className="bg-white/50 rounded-xl p-6 border border-gray-200">
                  <label className="block text-sm text-[#0f172a]/80 mb-2 font-medium">
                    {q.question}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData[q.field] || ''}
                      onChange={(e) => handleEditField(q.field, e.target.value)}
                      placeholder={q.placeholder}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-[#0f172a] text-lg">
                        {formData[q.field] || <span className="text-[#0f172a]/30 italic">Not provided</span>}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {isEditing ? (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    <span className="text-lg">Save Changes</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 px-8 py-4 glass rounded-2xl text-[#0f172a] hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-5 h-5" />
                      <span className="text-lg">Edit Details</span>
                    </button>
                    <button
                      onClick={handleConfirmAndContinue}
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl premium-shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">Confirm & Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </VerificationLayout>
  );
}