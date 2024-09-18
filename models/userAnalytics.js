const mongoose = require("mongoose");
const syncMiddleware = require("../middleware/syncMiddleware");

const userAnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "BnyGeneral", required: true },
  journeyDuration: { type: Number, required: true },
  goalSelected: { type: String, required: true },
  stepsCompleted: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

userAnalyticsSchema.plugin(syncMiddleware, 'UserAnalytics');

module.exports = mongoose.model("UserAnalytics", userAnalyticsSchema);
