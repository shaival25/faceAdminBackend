const bnyGeneralController = require("../controllers/bnyGeneralController");
const bnyKYCController = require("../controllers/bnyKYCController");
const feedbackController = require("../controllers/feedBackController");
const sipCalcController = require("../controllers/sipCalcController");
const express = require("express");

const router = express.Router();

router.post("/general", bnyGeneralController.saveBnyFormData);
router.post("/kyc", bnyKYCController.saveBnyKYC);
router.post("/feedback", feedbackController.saveFeedback);
router.post("/sip-calc", sipCalcController.saveSipCalc);

module.exports = router;
