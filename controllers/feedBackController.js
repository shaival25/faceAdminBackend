const Feedback = require("../models/Feedback");

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

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
