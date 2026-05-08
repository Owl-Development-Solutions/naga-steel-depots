import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import dotenv from "dotenv";
dotenv.config();

export const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY!,
});
