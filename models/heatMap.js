const mongoose = require("mongoose");
const config = require("../config/config");
const syncMiddleware = require("../middleware/syncMiddleware");

const heatMapSchema = new mongoose.Schema(
  {
    heatMap: { type: String, required: true },
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
  { collection: "heatmaps" }
);

heatMapSchema.plugin(syncMiddleware, "HeatMap");

module.exports = mongoose.model("HeatMap", heatMapSchema);
