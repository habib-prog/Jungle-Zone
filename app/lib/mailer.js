import nodemailer from "nodemailer";

const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(
      "EMAIL_USER and EMAIL_PASS environment variables must be set to send emails."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
};

/// SEND MAIL HELPER
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    return await transporter.sendMail({
      from: `"jungleZone" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    // Surface the real provider error (e.g. Gmail "535 Username and Password not accepted")
    console.error(
      "[mailer] Failed to send email to",
      to,
      "-",
      error?.response || error?.message || error
    );
    throw error;
  }
};
