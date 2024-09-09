const express = require("express");
const router = express.Router();
const faceDetectionController = require("../controllers/faceDetectionController");
const authenticate = require("../middleware/authMiddleware");
const uploadImage = require("../middleware/uploadFDImageMiddleware");
const checkRole = require("../middleware/permissionMiddleware");

// Apply role-based authentication middleware dynamically
router.post(
  "/face-detection",
  uploadImage.uploadImage,
  faceDetectionController.createFaceDetection
);
router.get(
  "/face-detection",
  authenticate,
  checkRole(["manage-faceDetection:read"]),
  faceDetectionController.getFaceDetections
);

router.get("/face-detection/view/:filename", faceDetectionController.getImages);

module.exports = router;
