const express = require("express");
const router = express.Router();

const userAnalyticsController = require("../controllers/userAnalyticsController");

router.get("/journey-started/:userId", userAnalyticsController.startJourney);
router.post("/goal-selected", userAnalyticsController.goalSelected);
router.get("/journey-ended/:userId", userAnalyticsController.endJourney);

module.exports = router;
