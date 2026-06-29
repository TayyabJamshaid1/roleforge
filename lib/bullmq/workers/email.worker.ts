import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import { Worker } from "bullmq";
import { bullmqConnection } from "../connection";
import { sendEmail } from "@/lib/email";

const worker = new Worker(
  "email-queue",
  async (job) => {
    const { to, subject, html } = job.data;
console.log(html,"html in mail send");

    await sendEmail({
      to,
      subject,
      html,
    });

    console.log("Email sent:", to);
  },
  {
    connection: bullmqConnection,
  }
);

worker.on("completed", (job) => {
  console.log(`Email job completed: ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`Email job failed: ${job?.id}`, error.message);
});