const twilio = require("twilio");
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendSMS = async (options, res) => {
  try {
    // Initialize the Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Send SMS, using 'await' to ensure it completes before proceeding
    await client.messages.create({
      body: `Your OTP is: ${options.otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, // From Twilio number (from env)
      to: options.phone, // Recipient's phone number
    });

    console.log("SMS sent successfully!");
    return res.status(200).json({message: "SMS sent successfully"});
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

const sendEmail = async (options, res) => {
  try {
    console.log(process.env.EMAIL_USER); // Should print your email address
    console.log(process.env.EMAIL_PASS); // Should print your password or app-specific password
    // Setup the Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.htm
    };

    // Send email, using 'await' to ensure it completes before proceeding
    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully!");
    return res.status(200).json({message: "Email sent successfully"});
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail, sendSMS };
