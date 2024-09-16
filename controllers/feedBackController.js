const Feedback = require("../models/feedback");

exports.saveFeedback = async (req, res) => {
  try {
    const feedbacks = req.body;
    const promises = feedbacks.map((feedback) => {
      const newFeedback = new Feedback({
        question: feedback.question,
        response: feedback.response,
      });
      return newFeedback.save();
    });
    const results = await Promise.all(promises);
    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
