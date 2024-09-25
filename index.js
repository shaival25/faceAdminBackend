const express = require("express");
const app = express();
const connectDB = require("./config/database");
const donwloadsRoutes = require("./routes/downloadRoutes");
const heatMapRoutes = require("./routes/heatMapRoutes");
const personCounterRoutes = require("./routes/personCounterRoutes");
const bnyScreenRoutes = require("./routes/bnyScreenRoutes");
const userAnalyticsRoutes = require("./routes/userAnalyticsRoutes");
const busConfig = require("./controllers/busController");
const { startFileWatcher } = require("./services/uploadsSync"); // Import file watcher service

const fs = require("fs");
const path = require("path");
const https = require("https");
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
app.use("/api/person-counter", personCounterRoutes);
app.use("/api/bny", bnyScreenRoutes);
app.use("/api/heat-map", heatMapRoutes);
app.use("/api/user-analytics", userAnalyticsRoutes);

startFileWatcher();

const httpsServer = https.createServer(credentials, app);
busConfig.initialize().then(() => {
  // Start server
  httpsServer.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
  const { processSyncQueue } = require("./services/syncService");
  // Sync process: Trigger syncing of queued operations periodically
  setInterval(async () => {
    await processSyncQueue();
  }, 10000); // Sync every 60 seconds

  // app.listen(config.port, () => {
  //   console.log(`Server running on port ${config.port}`);
  // });
});
