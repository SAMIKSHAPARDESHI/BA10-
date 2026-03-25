const User = require("../models/user");
const bcrypt = require("bcryptjs");

const KYC = require("../models/KYC");

// SAVE KYC DATA
exports.saveKYC = async (req, res) => {
  try {
    const data = req.body;

    const newKYC = new KYC(data);
    await newKYC.save();

    res.json({ message: "KYC Data Saved" });
  } catch (err) {
    res.status(500).json({ message: "Error saving KYC" });
  }
};
// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Error in registration" });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};

exports.evaluateKYC = (req, res) => {
  const {
    faceMatchScore,
    signatureMatchScore,
    livenessStatus,
  } = req.body;

  let status = "Review";

  if (
    faceMatchScore > 80 &&
    signatureMatchScore > 75 &&
    livenessStatus === true
  ) {
    status = "Approved";
  } else if (
    faceMatchScore < 50 ||
    signatureMatchScore < 50
  ) {
    status = "Rejected";
  }

  res.json({ status });
};