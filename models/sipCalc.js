const mongoose = require("mongoose");
const config = require("../config/config");
const syncMiddleware = require("../middleware/syncMiddleware");

const sipCalcSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "BnyGeneral",
      required: true,
    },
    investmentDuration: { type: Number, required: true }, // In years
    expectedROR: { type: Number, required: true }, // Expected rate of return
    maturityAmount: { type: Number, required: true },
    monthlyInvestment: { type: Number, required: true },
    totalInvestment: { type: Number, required: true },
    goalSelected: { type: String, required: true },
    macAddress: {
      type: String,
      ref: "Bus",
      required: true,
      default: config.macAddress,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },
  },
  { collection: "sipcalcs" }
);

sipCalcSchema.plugin(syncMiddleware, "SipCalc");

module.exports = mongoose.model("SipCalc", sipCalcSchema);
