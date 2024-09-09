const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const authenticate = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissionMiddleware");

// Get roles
router.get(
  "/roles",
  authenticate,
  checkPermission("manage-roles:read"),
  roleController.getRoles
);

// Create role
router.post(
  "/roles",
  authenticate,
  checkPermission("manage-roles:create"),
  roleController.createRole
);

// Update role
router.put(
  "/roles/:id",
  authenticate,
  checkPermission("manage-roles:update"),
  roleController.updateRole
);

// Delete role
router.delete(
  "/roles/:id",
  authenticate,
  checkPermission("manage-roles:delete"),
  roleController.deleteRole
);

// Get role by ID
router.get(
  "/roles/:id",
  // authenticate,
  // checkPermission("manage-roles:read"),
  roleController.getRoleById
);
module.exports = router;
