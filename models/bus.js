const mongoose = require("mongoose");
const syncMiddleware = require("../middleware/syncMiddleware");


const BusSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  macAddress: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

// Apply the sync middleware
BusSchema.plugin(syncMiddleware, 'Bus');

module.exports = mongoose.model("Bus", BusSchema);
