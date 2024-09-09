const mongoose = require("mongoose");
const Permission = require("../models/Permission");
const { mongoURI } = require("../config/config");

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const permissions = [
  {
    name: "manage-users:create",
    permissionType: "users",
    description: "Create user accounts",
  },
  {
    name: "manage-users:read",
    permissionType: "users",
    description: "Read user accounts",
  },
  {
    name: "manage-users:update",
    permissionType: "users",
    description: "Update user accounts",
  },
  {
    name: "manage-users:delete",
    permissionType: "users",
    description: "Delete user accounts",
  },
  {
    name: "manage-roles:read",
    permissionType: "roles",
    description: "Read user roles",
  },
  {
    name: "manage-roles:create",
    permissionType: "roles",
    description: "Create user roles",
  },
  {
    name: "manage-roles:delete",
    permissionType: "roles",
    description: "Delete roles",
  },
  {
    name: "manage-roles:update",
    permissionType: "roles",
    description: "Update roles",
  },
  {
    name: "manage-permissions:read",
    permissionType: "permissions",
    description: "Read permissions",
  },
  //   {
  //     name: "manage-faceDetection:create",
  //     description: "Add face detections data",
  //   },
  {
    name: "manage-faceDetection:read",
    permissionType: "faceDetection",
    description: "Read face detections data",
  },
  // Add more permissions as needed
];

const populatePermissions = async () => {
  try {
    for (const perm of permissions) {
      const existingPerm = await Permission.findOne({ name: perm.name });
      if (!existingPerm) {
        await new Permission(perm).save();
        console.log(`Permission "${perm.name}" added`);
      } else {
        console.log(`Permission "${perm.name}" already exists`);
      }
    }
    mongoose.connection.close();
  } catch (err) {
    console.error(err.message);
    mongoose.connection.close();
  }
};

populatePermissions();
