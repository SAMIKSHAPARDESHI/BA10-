const express = require("express");
const router = express.Router();
const Signature = require("../models/Signature");

router.post("/save-signature", async (req, res) => {
  try {
    console.log("🔥 API HIT");

    const { image } = req.body;

    if (!image) {
      console.log("❌ No image received");
      return res.status(400).json({ error: "No image provided" });
    }

    console.log("📸 Image length:", image.length);

    const newSignature = new Signature({
      image: image,
    });

    await newSignature.save();

    console.log("✅ SAVED TO MONGODB");

    res.json({ success: true, message: "Signature saved" });
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;