const mongoose = require("mongoose");

const SignatureSchema = new mongoose.Schema({
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Signature", SignatureSchema);