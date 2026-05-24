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
  try {
    const info = await transport.sendMail({
      from: `NexForm <${env.NODEMAILER_GMAIL}>`,
      to: sendTo,
      subject,
      html,
    });

    if (!info) {
      throw new Error("Email was not sent - no response from mail service");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown email error";
    console.error("Failed to send email:", errorMessage);
    throw new Error(`Failed to send email to ${sendTo}: ${errorMessage}`);
  }
};

export { sendMail };
