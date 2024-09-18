const express = require("express");
const router = express.Router();
const heatMapController = require("../controllers/heatMapController");
const uploadImage = require("../middleware/uploadHeatMap");

router.post("/", uploadImage.uploadImage, heatMapController.saveHeatMap);
module.exports = router;
