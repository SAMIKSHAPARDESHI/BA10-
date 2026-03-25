const { spawn } = require("child_process");

exports.runBlink = () => {
  return new Promise((resolve, reject) => {
    const py = spawn("python", [
      "../../ekyc_prototype/liveness/liveness_main.py",
    ]);

    py.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    py.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    py.on("close", () => {
      resolve("Blink detection completed");
    });
  });
};
