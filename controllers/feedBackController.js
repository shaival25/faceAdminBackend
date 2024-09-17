const Feedback = require("../models/feedback");

exports.saveFeedback = async (req, res) => {
  try {
    const feedbacks = req.body;
    const results = [];

    Object.keys(feedbacks).forEach((key) => async () => {
      const newFeedback = new Feedback({
        question: key,
        response: feedbacks[key],
      });
      const savedFeedback = await newFeedback.save();
      results.push(savedFeedback);
    });
    res.status(201).json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
