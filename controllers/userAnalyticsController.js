const UserAnalytics = require("../models/userAnalytics");

exports.startJourney = async (req, res) => {
  try {
    const userId = req.params.userId;
    const existingJourney = await UserAnalytics.findOne({ userId });
    if (existingJourney) {
      const newJourney = await UserAnalytics.findOneAndUpdate(
        { userId },
        { journeyStarted: new Date() },
        { new: true }
      );
      res.status(201).json(newJourney);
    } else {
      const newJourney = new UserAnalytics({
        userId,
        journeyStarted: new Date(),
        goalSelected: null,
      });
      await newJourney.save();
      res.status(201).json({ message: "Journey Started" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.goalSelected = async (req, res) => {
  try {
    const { userId } = req.body;
    const { goalSelected } = req.body;

    const existingJourney = await UserAnalytics.findOne({ userId });
    if (existingJourney) {
      const newJourney = await UserAnalytics.findOneAndUpdate(
        { userId },
        { goalSelected },
        { new: true }
      );
      res.status(201).json(newJourney);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.endJourney = async (req, res) => {
  try {
    const { userId } = req.params;

    const journeyStarted = await UserAnalytics.findOne(
      { userId },
      { journeyStarted: 1 }
    );
    const journeyEnded = new Date();
    const journeyDuration = journeyEnded - journeyStarted.journeyStarted;
    await UserAnalytics.findOneAndUpdate(
      { userId },
      { journeyEnded, journeyDuration },
      { new: true }
    );
    res.status(200).json({ message: "Journey Ended" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
