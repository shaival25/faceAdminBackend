const express = require("express");
const router = express.Router();
const faceDetectionController = require("../controllers/faceDetectionController");
const uploadImage = require("../middleware/uploadFDImageMiddleware");

// Apply role-based authentication middleware dynamically
router.post(
  "/",
  uploadImage.uploadImage,
  faceDetectionController.createFaceDetection
);

router.get("/view/:filename/:busId", faceDetectionController.getImages);

module.exports = router;
