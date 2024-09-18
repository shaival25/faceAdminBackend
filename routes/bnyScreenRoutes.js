const express = require("express");
const router = express.Router();
const bnyGeneralController = require("../controllers/bnyGeneralController");
const feedbackController = require("../controllers/feedBackController");
const sipCalcController = require("../controllers/sipCalcController");
const bus = require("../controllers/busController");
const config = require("../config/config");
const uploadImage = require("../middleware/uploadFDImageMiddleware");

router.post(
  "/general",
  uploadImage.uploadImage,
  uploadImage.saveToSecondLocation,
  bnyGeneralController.saveBnyFormData
);
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

router.get("/id/:id", bnyGeneralController.getId);

module.exports = router;
