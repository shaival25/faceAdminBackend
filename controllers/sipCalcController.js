const SipCalc = require("../models/sipCalc");
const postmark = require("postmark");
const BnyGeneral = require("../models/bnyGeneral");
const UserAnalytics = require("../models/userAnalytics"); // Make sure to include the UserAnalytics model if it's not already imported
const config = require("../config/config");

exports.saveSipCalc = async (req, res) => {
  try {
    const {
      investmentDuration,
      expectedROR,
      maturityAmount,
      userId,
      monthlyInvestment,
      totalInvestment,
    } = req.body;

    // Create and save the new SipCalc entry
    const newSipCalc = new SipCalc({
      userId,
      investmentDuration,
      expectedROR,
      maturityAmount,
      monthlyInvestment,
      totalInvestment,
    });

    await newSipCalc.save();

    // Initialize the Postmark client
    const client = new postmark.ServerClient(config.POSTMARK_API_KEY);

    // Find the user by userId
    const user = await BnyGeneral.findById(userId);

    // If user is not found
    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    const email = user.email;
    const name = user.fullName;

    // Send the email using Postmark
    const emailResponse = await client.sendEmail({
      From: "info@bharatniveshyatra.com",
      To: email,
      Subject: "Hello from Postmark",
      HtmlBody: `<strong>Hello ${name}</strong>, welcome to Postmark!`,
      TextBody: `Hello ${name}, welcome to Postmark!`,
      MessageStream: "outbound",
    });
    if (emailResponse && emailResponse.ErrorCode === 0) {
      // Update user analytics after sending the email
      const userAnalytics = await UserAnalytics.findOne({ userId });
      if (userAnalytics) {
        userAnalytics.emailSent = true;
        await userAnalytics.save();
      }
      return res
        .status(201)
        .json({ message: "Email sent successfully", emailResponse });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
