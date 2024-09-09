const mongoose = require("mongoose");

const generateQRSchema = new mongoose.Schema({
  originalImageUrl: { type: String, required: true }, // Store the filename of the image
  qrImageUrl: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

module.exports = mongoose.model("GenerateQR", generateQRSchema);
