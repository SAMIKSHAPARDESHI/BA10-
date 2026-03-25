const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();

/* Test route */
router.get("/test", (req, res) => {
  res.send("Liveness route working");
});

/* Blink detection route */
router.post("/blink", (req, res) => {
  // Absolute path to Python script
  const scriptPath = path.join(
    __dirname,
    "../../../ekyc_prototype/liveness/blink.py"
  );

  console.log("Running script:", scriptPath);

  const pythonProcess = spawn("python", [scriptPath]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  pythonProcess.on("close", () => {
    res.json({ success: true });
  });
});

module.exports = router;
