const mongoose = require("mongoose");
const config = require("../config/config");
const syncMiddleware = require("../middleware/syncMiddleware");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "BnyGeneral",
      required: true,
    },
    responses: [
      {
        question: { type: String, required: true },
        response: { type: String, required: true },
        _id: false,
      },
    ],
    macAddress: {
      type: String,
      ref: "Bus",
      required: true,
      default: config.macAddress,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { collection: "feedbacks" }
);

feedbackSchema.plugin(syncMiddleware, "Feedback");
module.exports = mongoose.model("Feedback", feedbackSchema);
