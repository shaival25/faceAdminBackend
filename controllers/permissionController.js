const Permission = require("../models/Permission");

// Get all permissions
exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
