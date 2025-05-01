const nodemailer = require("nodemailer");
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const { SENDGRID_API_KEY } = process.env;

function replaceContent(content, creds) {
  const allKeys = Object.keys(creds);
  allKeys.forEach(function (key) {
    content = content.replace(`#{${key}}`, creds[key]);
  });
  return content;
}

async function EmailHelper(templateName, receiverEmail, creds) {
  try {
    const templatePath = path.join(__dirname, "email_templates", templateName);
    const content = await fs.promises.readFile(templatePath, "utf-8");
    const emailDetails = {
      to: receiverEmail,
      from: "chanakyasai5@gmail.com",
      subject: "Your OTP for verification",
      text: `Hi ${creds.name}, Your OTP is ${creds.otp}`,
      html: replaceContent(content, creds),
    };
    const transportDetails = {
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: SENDGRID_API_KEY,
      },
    };

    const transporter = nodemailer.createTransport(transportDetails);
    await transporter.sendMail(emailDetails);
    console.log("Email sent successfully");
  } catch (err) {
    console.log(err);
  }
}

module.exports = EmailHelper;
