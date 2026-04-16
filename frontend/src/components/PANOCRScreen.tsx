import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { ScanLine, Check, Sparkles, Camera, ArrowRight, AlertCircle } from "lucide-react";
import { VerificationLayout } from "./VerificationLayout";
import { BackButton } from "./BackButton";

export function PANOCRScreen() {
  const navigate = useNavigate();

  // 🔹 STATES
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [extractedData, setExtractedData] = useState({
    panNumber: "",
    dob: "",
  });

  // 🔹 REFS
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 🔹 START CAMERA

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (err) {
    console.error("Camera error:", err);
  }
};

// ✅ ADD HERE (JUST BELOW)
const stopCamera = () => {
  const video = videoRef.current;

  if (video && video.srcObject) {
    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
  }
};

  useEffect(() => {
  startCamera();
}, []);

  // 🔹 CAPTURE FRAME
  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg");
  };

  // 🔹 AUTO OCR
  const autoCaptureAndSend = async () => {
  console.log("🔥 Capture clicked");

  let frames: string[] = [];

  for (let i = 0; i < 5; i++) {
    const frame = captureFrame();
    if (frame) frames.push(frame);
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("📸 Frames captured:", frames.length);

  if (frames.length === 0) {
    console.log("❌ No frames captured");
    return;
  }

  const bestFrame = frames[Math.floor(frames.length / 2)];

  setIsProcessing(true);

  try {
    console.log("🚀 Sending to backend...");

    const res = await fetch("http://localhost:5001/api/pan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: bestFrame }),
    });

    console.log("📡 Response status:", res.status);

    const data = await res.json();

    console.log("✅ OCR DATA:", data);

    setExtractedData({
      panNumber: data.pan || "",
      dob: data.dob || "",
    });

    setIsComplete(true);
    setProcessingProgress(100);

  } catch (err) {
    console.error("❌ ERROR:", err);
  }

  setIsProcessing(false);
};

  // 🔹 CONTINUE
  const handleContinue = () => {
    navigate("/signature");
  };

  return (
    <VerificationLayout>
      <BackButton />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-6xl w-full bg-white rounded-3xl p-10 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* 🔥 CAMERA SECTION */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Document Scan</h3>

              <div className="aspect-[1.6/1] rounded-2xl overflow-hidden border-2 border-purple-200 relative">

                {/* 🎥 CAMERA */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* 🧠 OVERLAY */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-[90%] h-[65%] border-4 border-white rounded-xl" />
                </div>

                {/* TEXT */}
                {!isProcessing && !isComplete && (
                  <div className="absolute bottom-3 w-full text-center text-white text-sm">
                    Align PAN inside the box
                  </div>
                )}

                {/* PROCESSING */}
                {isProcessing && (
                  <>
                    <motion.div className="absolute inset-0 bg-purple-500/10" />
                    <motion.div className="absolute inset-x-0 h-1 bg-purple-500" />
                  </>
                )}

                {/* COMPLETE */}
                {isComplete && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                    <Check className="w-12 h-12 text-white" />
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>
            

            <div className="flex gap-3 mt-4 justify-center">
  <button
    onClick={startCamera}
    className="bg-green-500 text-white px-4 py-2 rounded-lg"
  >
    Start
  </button>

  <button
    onClick={stopCamera}
    className="bg-red-500 text-white px-4 py-2 rounded-lg"
  >
    Stop
  </button>

  <button
    onClick={autoCaptureAndSend}
    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
  >
    Capture
  </button>
</div>

            {/* 🔥 RESULT SECTION */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Extracted Information</h3>

              <div className="space-y-4">
                <div className="p-4 border rounded-xl">
                  <p>PAN Number</p>
                  <p>{extractedData.panNumber || "XXXXX0000X"}</p>
                </div>

                <div className="p-4 border rounded-xl">
                  <p>DOB</p>
                  <p>{extractedData.dob || "--/--/----"}</p>
                </div>

              </div>

              {isComplete && (
                <button
                  onClick={handleContinue}
                  className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl"
                >
                  Continue
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </VerificationLayout>
  );
}