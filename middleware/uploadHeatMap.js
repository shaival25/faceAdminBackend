const multer = require("multer");
const path = require("path");
const fs = require("fs");
const BusController = require("../controllers/busController");
const config = require("../config/config");

// Setup storage for images with bus name in folder path and counter-based filenames
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const busName = await BusController.getBusName(config.macAddress); // Get the bus name dynamically
      const uploadsFolder = path.join(
        __dirname,
        `../uploads/${busName}/heat-map-images`
      );

      // Check if the directory exists, if not create it
      if (!fs.existsSync(uploadsFolder)) {
        fs.mkdirSync(uploadsFolder, { recursive: true }); // Create folder recursively
      }

      cb(null, uploadsFolder);
    } catch (error) {
      cb(error, null); // Pass error to multer in case of failure
    }
  },
  filename: async (req, file, cb) => {
    try {
      req.heatMap = file.originalname;
      cb(null, file.originalname);
    } catch (error) {
      cb(error, null); // Pass error in case of failure
    }
  },
});

const upload = multer({ storage });

// Middleware for handling image uploads
exports.uploadImage = upload.single("image");
