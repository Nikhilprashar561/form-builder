import nodemailer from "nodemailer";
import { env } from "../env";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.NODEMAILER_GMAIL,
    pass: env.NODEMAILER_GMAIL_PASS,
  },
});

interface EmailData {
  sendTo: string;
  subject: string;
  html: string;
}

const sendMail = async ({ sendTo, subject, html }: EmailData): Promise<void> => {
  const info = await transport.sendMail({
    from: `NexForm <${env.NODEMAILER_GMAIL}>`,
    to: sendTo,
    subject,
    html,
  });

  if (!info) {
    console.log("Email was not sent");
  }
};

export { sendMail };
