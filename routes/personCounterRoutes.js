const router = require("express").Router();
const personCounterController = require("../controllers/personCounterController");

router.get("/", personCounterController.IncreasePersonCounter);
module.exports = router;
