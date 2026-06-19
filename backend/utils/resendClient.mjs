import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

let resend;

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required to send email.");
  }

  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  return resend;
};

export const getFromAddress = (name) => {
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL is required to send email.");
  }

  if (!name || fromEmail.includes("<")) {
    return fromEmail;
  }

  return `"${name}" <${fromEmail}>`;
};

export const getAdminEmail = () =>
  process.env.ADMIN_EMAIL ||
  process.env.RESEND_ADMIN_EMAIL ||
  process.env.RESEND_FROM_EMAIL;

export const sendMail = async ({ from, to, subject, html, text, replyTo }) => {
  const response = await getResendClient().emails.send({
    from: from || getFromAddress(),
    to,
    subject,
    html,
    text,
    replyTo,
  });

  if (response.error) {
    throw new Error(response.error.message || "Resend email delivery failed.");
  }

  return response.data;
};
