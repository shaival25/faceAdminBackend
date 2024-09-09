const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");
const authenticate = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissionMiddleware");

// Get permissions
router.get(
  "/permissions",
  authenticate,
  checkPermission("manage-permissions:read"),
  permissionController.getPermissions
);

module.exports = router;
