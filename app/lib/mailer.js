import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_SECURE = process.env.SMTP_SECURE !== "false";
const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;
const FROM_NAME = process.env.FROM_NAME || "jungleZone";
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.EMAIL_USER;

const createTransporter = () => {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "SMTP credentials missing. Set SMTP_USER/SMTP_PASS or EMAIL_USER/EMAIL_PASS."
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    return await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error(
      "[mailer] Failed to send email to",
      to,
      "-",
      error?.response || error?.message || error
    );
    throw error;
  }
};
