const mongoose = require("mongoose");
const syncMiddleware = require("../middleware/syncMiddleware");
const config = require("../config/config");

const bnyGeneralSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: { type: String },
    gender: { type: String },
    dob: { type: String },
    city: { type: String },
    state: { type: String },
    contactNumber: { type: Number, length: 10 },
    image: { type: String },
    counter: { type: Number },
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
  { collection: "bnygenerals" }
);

// Apply the sync middleware
bnyGeneralSchema.plugin(syncMiddleware, "BnyGeneral");

module.exports = mongoose.model("BnyGeneral", bnyGeneralSchema);
