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

if (process.env.NODE_ENV === "test") createInfoFile();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  macAddress: process.env.MAC_ADDRESS,
  atlasURI: process.env.ATLAS_URL,
  pingURL: process.env.PING_URL,
  POSTMARK_API_KEY: process.env.POSTMARK_API_KEY,
  apiKey: process.env.API_KEY,
  faceRecoPath: "/path/to/faceReco/", // 🚨 --> example --> path.join(__dirname, "..", "..", "/face"),
  preProcessedImagesFolderName: "/folder_name", //🚨 --> example --> "/preProcessingImages",
};
