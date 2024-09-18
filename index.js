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

const syncMiddleware = require("./middleware/syncMiddleware"); // Middleware for syncing models
const atlasDB = require("./config/atlasDB");
const { processSyncQueue } = require("./services/syncService"); // Sync service for processing the queue

// Import models
const bnyGeneral = require("./models/bnyGeneral");
const bus = require("./models/bus");
const feedback = require("./models/feedback");
const personCounter = require("./models/personCounter");
const sipCalc = require("./models/sipCalc");
const userAnalytics = require("./models/userAnalytics");
const heatMap = require("./models/heatMap");

// Atlas models (models connected to MongoDB Atlas)
const AtlasBnyGeneral = atlasDB.model("bnyGeneral", bnyGeneral.schema);
const AtlasBus = atlasDB.model("bus", bus.schema);
const AtlasFeedback = atlasDB.model("feedback", feedback.schema);
const AtlasPersonCounter = atlasDB.model("personCounter", personCounter.schema);
const AtlasSipCalc = atlasDB.model("sipCalc", sipCalc.schema);
const AtlasUserAnalytics = atlasDB.model("userAnalytics", userAnalytics.schema);
const AtlasheatMap = atlasDB.model("heatMap", heatMap.schema);

// Apply sync middleware to each model
bnyGeneral.schema.plugin(syncMiddleware, ["bnyGeneral", AtlasBnyGeneral]);
bus.schema.plugin(syncMiddleware, ["bus", AtlasBus]);
feedback.schema.plugin(syncMiddleware, ["feedback", AtlasFeedback]);
personCounter.schema.plugin(syncMiddleware, [
  "personCounter",
  AtlasPersonCounter,
]);
sipCalc.schema.plugin(syncMiddleware, ["sipCalc", AtlasSipCalc]);
userAnalytics.schema.plugin(syncMiddleware, [
  "userAnalytics",
  AtlasUserAnalytics,
]);
heatMap.schema.plugin(syncMiddleware, ["heatMap", AtlasheatMap]);

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
  await processSyncQueue(); // Process queued operations for syncing
}, 600000); // Sync every 60 seconds (adjust the interval as needed)

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
