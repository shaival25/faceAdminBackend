const mongoose = require("mongoose");

const FaceDetectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true }, // Store the filename of the image
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

module.exports = mongoose.model("FaceDetection", FaceDetectionSchema);
