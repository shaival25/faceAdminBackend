const mongoose = require("mongoose");
const config = require("../config/config");

const heatMapSchema = new mongoose.Schema(
  {
    heatMap: { type: String, required: true },
    macAddress: {
      type: String,
      ref: "Bus",
      required: true,
      default: config.macAddress,
    },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HeatMap", heatMapSchema);
