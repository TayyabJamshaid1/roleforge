import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { addEmailJob } from "@/lib/bullmq/queues/email.queue";

export async function GET() {
  await addEmailJob({
    to: "tayyabjamshaid78@gmail.com",
    subject: "RoleForge Email Test",
    html: "<h1>Email working ✅</h1><p>Resend is connected.</p>",
});
  // await sendEmail({
  //   to: "tayyabjamshaid78@gmail.com",
  //   subject: "RoleForge Email Test",
  //   html: "<h1>Email working ✅</h1><p>Resend is connected.</p>",
  // });

  return NextResponse.json({
    success: true,
    message: "Test email sent",
  });
}