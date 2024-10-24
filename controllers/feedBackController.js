const Feedback = require("../models/feedback");
const UserAnalytics = require("../models/userAnalytics");

exports.saveFeedback = async (req, res) => {
  try {
    const { feedbacks } = req.body;
    const { userId } = req.body;

    // Prepare the array of responses
    const responses = feedbacks.map((feedback) => {
      const question = Object.keys(feedback)[0];
      const response = feedback[question];
      return { question, response };
    });

    // Create the feedback entry with the responses array
    const newFeedback = new Feedback({
      responses,
      userId,
    });

    await newFeedback.save();
    const journeyStarted = await UserAnalytics.findOne(
      { userId },
      { journeyStarted: 1 }
    );
    const journeyEnded = new Date();
    const journeyDuration = journeyEnded - journeyStarted.journeyStarted;
    await UserAnalytics.findOneAndUpdate(
      { userId },
      { journeyEnded, journeyDuration }
    );
    res.status(200).json({
      message: "Feedback saved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
