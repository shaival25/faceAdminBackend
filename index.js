const express = require("express");
const app = express();
const connectDB = require("./config/database");
const generateQrRoutes = require("./routes/generateQRRoutes");
const faceDetectionRoutes = require("./routes/faceDetectionRoutes");
const donwloadsRoutes = require("./routes/downloadRoutes");
const personCounterRoutes = require("./routes/personCounterRoutes");
const busConfig = require("./controllers/busController");

const fs = require("fs");
const path = require("path");
const https = require("https");
require("./config/redisClient");
const cors = require("cors");

// Connect to the database
connectDB();
const config = require("./config/config");

const sslKey = fs.readFileSync(path.join(__dirname, "server.key"), "utf8");
const sslCert = fs.readFileSync(path.join(__dirname, "server.cert"), "utf8");

// Setup HTTPS credentials
const credentials = { key: sslKey, cert: sslCert };

// Create HTTPS server
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/downloads", donwloadsRoutes);

// Routes
app.use("/api", generateQrRoutes);
app.use("/api/face-detection", faceDetectionRoutes);
app.use("/api/person-counter", personCounterRoutes);

const httpsServer = https.createServer(credentials, app);
busConfig.initialize().then(() => {
  // Start server
  httpsServer.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
});
