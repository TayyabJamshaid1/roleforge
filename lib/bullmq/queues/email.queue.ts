import { Queue } from "bullmq";
import { bullmqConnection } from "../connection";

export const emailQueue = new Queue("email-queue", {
  connection: bullmqConnection,
});

export async function addEmailJob(data: {
  to: string;
  subject: string;
  html: string;
}) {
  await emailQueue.add("send-email", data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  });
}