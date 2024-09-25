const SipCalc = require("../models/sipCalc");
const postmark = require("postmark");
const BnyGeneral = require("../models/bnyGeneral");
const UserAnalytics = require("../models/userAnalytics"); // Make sure to include the UserAnalytics model if it's not already imported
const config = require("../config/config");
const fs = require("fs");
const path = require("path");

// Load the HTML template
const templatePath = path.join(
  __dirname,
  "..",
  "email-template",
  "emailer.html"
);
const emailTemplate = fs.readFileSync(templatePath, "utf8");

const formatIndianCurrency = (amount) => {
  if (amount === undefined || amount === null) return "N/A";
  const [integerPart, decimalPart] = amount.toString().split(".");
  const formattedIntegerPart = integerPart.replace(
    /(\d)(?=(\d\d)+\d$)/g,
    "$1,"
  );
  return `${formattedIntegerPart}${
    decimalPart ? "." + decimalPart.slice(0, 2) : ""
  }`;
};
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

    let emailReplacedTemplate = emailTemplate
      .replace("{{name}}", name)
      .replace("{{monthlyInvestment}}", monthlyInvestment)
      .replace("{{monthlyInvestment}}", formatIndianCurrency(monthlyInvestment))
      .replace("{{totalInvestment}}", formatIndianCurrency(totalInvestment))
      .replace("{{expectedROR}}", expectedROR)
      .replace("{{investmentDuration}}", investmentDuration)
      .replace("{{goalAmount}}", formatIndianCurrency(maturityAmount));

    // Send the email using Postmark
    const emailResponse = await client.sendEmail({
      From: "info@bharatniveshyatra.com",
      To: email,
      Subject: "Your Personalized Plan from Bharat Nivesh Yatra awaits!",
      HtmlBody: emailReplacedTemplate,
      TextBody: emailReplacedTemplate,
      MessageStream: "outbound",
    });
    if (emailResponse && emailResponse.ErrorCode === 0) {
      // Update user analytics after sending the email
      const userAnalytics = await UserAnalytics.findOne({ userId });
      if (userAnalytics) {
        userAnalytics.emailSent = true;
        await userAnalytics.save();
      }
      return res.status(200).json({ message: "Email sent successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
