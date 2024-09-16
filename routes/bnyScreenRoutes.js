const bnyGeneralController = require("../controllers/bnyGeneralController");
const bnyKYCController = require("../controllers/bnyKYCController");
const feedbackController = require("../controllers/feedBackController");
const sipCalcController = require("../controllers/sipCalcController");
const bus = require("../controllers/busController");
const express = require("express");
const config = require("../config/config");

const router = express.Router();

router.post("/general", bnyGeneralController.saveBnyFormData);
router.post("/kyc", bnyKYCController.saveBnyKYC);
router.post("/feedback", feedbackController.saveFeedback);
router.post("/sip-calc", sipCalcController.saveSipCalc);
router.get("/mac-address", (req, res) => {
  try {
    res.status(200).json({ macAddress: config.macAddress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/cities", bus.getCities);

module.exports = router;
