import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { PenTool, Check } from "lucide-react";
import { VerificationLayout } from "./VerificationLayout";
import { BackButton } from "./BackButton";

export function SignatureScreen() {
  const navigate = useNavigate();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [drawing, setDrawing] = useState(false);
  const [signatureCaptured, setSignatureCaptured] = useState(false);

  // ✅ INIT CANVAS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx!.fillStyle = "#ffffff";
    ctx!.fillRect(0, 0, canvas.width, canvas.height);

    ctx!.strokeStyle = "#000";
    ctx!.lineWidth = 3;
    ctx!.lineCap = "round";
  }, []);

  // ✅ GET POSITION (MOUSE + TOUCH)
  const getPos = (e: any) => {
    const rect = canvasRef.current!.getBoundingClientRect();

    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  // ✅ START DRAW
  const startDrawing = (e: any) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    setDrawing(true);
    const { x, y } = getPos(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // ✅ DRAW
  const draw = (e: any) => {
    if (!drawing) return;
    const ctx = ctxRef.current;
    if (!ctx) return;

    const { x, y } = getPos(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // ✅ STOP
  const stopDrawing = () => {
    setDrawing(false);
  };

  // ✅ RESET (like 'r')
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setSignatureCaptured(false);
  };

  // ✅ SAVE (like 's')
  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = canvas.toDataURL("image/png");

    // 🔥 SEND TO BACKEND
      const res = await fetch("http://localhost:5000/api/save-signature",  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image }),
    });

    const data = await res.json();
    console.log(data);

    setSignatureCaptured(true);
  };

  return (
    <VerificationLayout>
      <BackButton />

      <div className="max-w-4xl mx-auto px-8 py-16">

        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto bg-orange-500 rounded-xl flex items-center justify-center mb-3">
            <PenTool className="text-white" />
          </div>
          <h2 className="text-3xl font-semibold">Signature Capture</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">

          <h3 className="mb-3">Draw Your Signature</h3>

          {/* ✅ CANVAS */}
          <div className="border-2 border-dashed rounded-xl overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-[250px] touch-none cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-5">
            <button
              onClick={handleSave}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl"
            >
              Save Signature
            </button>

            <button
              onClick={clearCanvas}
              className="flex-1 bg-gray-200 py-3 rounded-xl"
            >
              Reset
            </button>
          </div>

          {/* STATUS */}
          {signatureCaptured && (
            <div className="mt-4 flex items-center gap-2 text-green-600">
              <Check />
              Signature saved successfully
            </div>
          )}

          {/* NEXT */}
          {signatureCaptured && (
            <button
              onClick={() => navigate("/voice-form")}
              className="w-full mt-5 bg-green-500 text-white py-3 rounded-xl"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </VerificationLayout>
  );
}