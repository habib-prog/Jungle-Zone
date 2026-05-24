import nodemailer from "nodemailer";

/// CREATE TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/// SEND MAIL HELPER
export const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: `"jungleZone" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  };

  return await transporter.sendMail(mailOptions);
};