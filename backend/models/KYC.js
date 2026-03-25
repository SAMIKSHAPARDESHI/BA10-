const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  name: String,
  dob: String,
  address: String,

  panNumber: String,

  faceMatchScore: Number,
  signatureMatchScore: Number,

  livenessStatus: Boolean,

  riskScore: Number,

  status: {
    type: String,
    enum: ["Approved", "Rejected", "Review"],
    default: "Review",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("KYC", kycSchema);