const express = require("express");
const router = express.Router();
const faceDetectionController = require("../controllers/faceDetectionController");
const authenticate = require("../middleware/authMiddleware");
const uploadImage = require("../middleware/uploadFDImageMiddleware");
const checkRole = require("../middleware/permissionMiddleware");

// Apply role-based authentication middleware dynamically
router.post(
  "/",
  uploadImage.uploadImage,
  faceDetectionController.createFaceDetection
);
router.get(
  "/",
  authenticate,
  checkRole(["faceDetection:read"]),
  faceDetectionController.getFaceDetections
);

router.delete(
  "/",
  authenticate,
  checkRole(["faceDetection:delete"]),
  faceDetectionController.deleteFaceDetection
);

router.get("/view/:filename/:busId", faceDetectionController.getImages);

module.exports = router;
