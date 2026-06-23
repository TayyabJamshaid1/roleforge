import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is missing");
}

if (!EMAIL_FROM) {
  throw new Error("EMAIL_FROM is missing");
}

const resend = new Resend(RESEND_API_KEY);

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const result = await resend.emails.send({
    from: EMAIL_FROM as string,
    to,
    subject,
    html,
  });

  return result;
}