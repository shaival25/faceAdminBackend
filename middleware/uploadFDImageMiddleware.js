const multer = require("multer");
const path = require("path");
const fs = require("fs");
const BnyGeneral = require("../models/bnyGeneral");
const BusController = require("../controllers/busController");
const config = require("../config/config");

// Function to get the next counter for the image name
const getCounter = async () => {
  const bnyGeneral = await BnyGeneral.findOne().sort({ createdAt: -1 });
  if (!bnyGeneral) {
    return 2;
  }
  return bnyGeneral.counter + 1;
};

// Setup storage for images with bus name in folder path and counter-based filenames
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const busName = await BusController.getBusName(config.macAddress); // Get the bus name dynamically
      const uploadsFolder1 = path.join(
        __dirname,
        `../uploads/${busName}/face-detection-images`
      );

      // Check if the directory exists, if not create it
      if (!fs.existsSync(uploadsFolder1)) {
        fs.mkdirSync(uploadsFolder1, { recursive: true }); // Create folder recursively
      }

      cb(null, uploadsFolder1);
    } catch (error) {
      cb(error, null); // Pass error to multer in case of failure
    }
  },
  filename: async (req, file, cb) => {
    try {
      const counter = await getCounter(); // Get the next counter value
      const filename = `${counter}.png`; // Use the counter as the filename (e.g., 1.png, 2.png)

      req.imageName = filename;
      cb(null, filename);
    } catch (error) {
      cb(error, null); // Pass error in case of failure
    }
  },
});

const upload = multer({ storage });

// Middleware for handling image uploads
exports.uploadImage = upload.single("image");

// Middleware to copy the image to a second location
exports.saveToSecondLocation = (req, res, next) => {
  if (!req.file) {
    return next(new Error("No file uploaded")); // Handle the error if no file was uploaded
  }

  const filename = req.file.filename;
  const sourcePath = req.file.path; // Path of the file just saved
  const secondaryFolder = path.join(
    __dirname,
    `../uploads/face-detection-images1`
  );

  // Check if the secondary directory exists, if not create it
  if (!fs.existsSync(secondaryFolder)) {
    fs.mkdirSync(secondaryFolder, { recursive: true });
  }

  const secondaryPath = path.join(secondaryFolder, filename);

  // Copy the file to the secondary location
  fs.copyFile(sourcePath, secondaryPath, (err) => {
    if (err) {
      return next(err); // Pass error to next middleware
    }
    next(); // Proceed to the next middleware or route handler
  });
};
