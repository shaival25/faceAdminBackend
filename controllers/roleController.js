const Role = require("../models/role");
// const redis = require("../config/redisClient");

// Get all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions");
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create a new role
exports.createRole = async (req, res) => {
  const { name, permissions } = req.body;

  try {
    const newRole = new Role({ name, permissions });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { permissions } = req.body; // Array of permission IDs

  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ msg: "Role not found" });
    }

    role.permissions = permissions;
    role.updated_at = Date.now();
    role.__v = role.__v + 1;
    await role.save();

    // Invalidate the cache for this role
    // const redisKey = `role_permissions:${id}`;
    // await redis.del(redisKey);

    res
      .status(200)
      .json({ msg: "Role permissions updated and cache invalidated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Role.findByIdAndUpdate(
      id,
      { deleted_at: Date.now() },
      { new: true }
    );
    if (!role) {
      return res.status(404).json({ msg: "Role not found" });
    }

    // Invalidate the cache for this role
    // const redisKey = `role_permissions:${id}`;
    // await redis.del(redisKey);

    res.status(200).json({ msg: "Role deleted and cache invalidated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findById(id).populate("permissions");
    if (!role) {
      return res.status(404).json({ msg: "Role not found" });
    }
    res.status(200).json(role);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};
