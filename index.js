const express = require("express");
const app = express();
const connectDB = require("./config/database");
const donwloadsRoutes = require("./routes/downloadRoutes");
const heatMapRoutes = require("./routes/heatMapRoutes");
const personCounterRoutes = require("./routes/personCounterRoutes");
const bnyScreenRoutes = require("./routes/bnyScreenRoutes");
const busConfig = require("./controllers/busController");

const fs = require("fs");
const path = require("path");
const https = require("https");
require("./config/redisClient");
const cors = require("cors");

// Connect to the database
connectDB();
const config = require("./config/config");

const { processSyncQueue } = require('./services/syncService');

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
app.use("/api/person-counter", personCounterRoutes);
app.use("/api/bny", bnyScreenRoutes);
app.use("/api/heat-map", heatMapRoutes);

// Sync process: Trigger syncing of queued operations periodically
setInterval(async () => {
  await processSyncQueue();
}, 60000); // Sync every 60 seconds



const httpsServer = https.createServer(credentials, app);
busConfig.initialize().then(() => {
  // Start server
  // httpsServer.listen(config.port, () => {
  //   console.log(`Server running on port ${config.port}`);
  // });
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
});
