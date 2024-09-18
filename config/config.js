require("dotenv").config();

const fs = require("fs");
const path = require("path");

const INFO_FILE_PATH = path.join(__dirname, "..", "info.json");

function createInfoFile() {
  if (!fs.existsSync(INFO_FILE_PATH)) {
    const data = {
      Unknown: ["Unknown", "M"],
    };
    fs.writeFileSync(INFO_FILE_PATH, JSON.stringify(data, null, 2));
  }
}

createInfoFile();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/faceAdminDB",
  macAddress: process.env.MAC_ADDRESS || "08-71-90-32-8B-2E",
};
