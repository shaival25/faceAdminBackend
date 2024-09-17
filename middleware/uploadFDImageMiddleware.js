const multer = require("multer");
const path = require("path");
const fs = require("fs");
const BnyGeneral = require("../models/bnyGeneral");
const BusController = require("../controllers/busController");
const config = require("../config/config");

// Function to get the next counter for image name
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
      const uploadsFolder = path.join(
        __dirname,
        `../uploads/${busName}/face-detection-images`
      );

      // Check if the directory exists, if not create it
      if (!fs.existsSync(uploadsFolder)) {
        fs.mkdirSync(uploadsFolder, { recursive: true }); // Create  folder recursively
      }

      cb(null, uploadsFolder);
    } catch (error) {
      cb(error, null); // Pass error to multer in case of failure
    }
  },
  filename: async (req, file, cb) => {
    try {
      const counter = await getCounter(); // Get the next counter value
      const ext = path.extname(file.originalname); // Get the file extension (e.g., .png)
      const filename = `${counter}.png`; // Use the counter as the filename (e.g., 1.png, 2.png)

      req.imageName = filename;
      cb(null, filename);
    } catch (error) {
      cb(error, null); // Pass error in case of failure
    }
  },
});

const upload = multer({ storage });

exports.uploadImage = upload.single("image"); // Middleware for handling image uploads
