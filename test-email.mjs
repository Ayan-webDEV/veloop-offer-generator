import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const apiKey = process.env.RESEND_API_KEY_2;
const toEmail = process.env.TO_EMAIL_2;
const fromEmail = process.env.FROM_EMAIL_2;

if (!apiKey || !toEmail || !fromEmail) {
  console.error("❌ Missing environment variables.");
  process.exit(1);
}

const resend = new Resend(apiKey);

async function sendTestEmail() {
  console.log("📧 Starting Resend email test...");
  console.log("From:", fromEmail);
  console.log("To:", toEmail);

  try {
    const { data, error } = await resend.emails.send({
      from: `VELOOP Rewards <${fromEmail}>`,
      to: [toEmail],
      subject: "VELOOP Rewards - Email Test",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          padding: 25px;
          background: #f5f5f5;
        ">
          <div style="
            max-width: 500px;
            margin: auto;
            padding: 25px;
            background: white;
            border-radius: 12px;
          ">
            <h2 style="color: #2563eb;">
              VELOOP Rewards
            </h2>

            <h3>Email Delivery Test Successful!</h3>

            <p>
              Congratulations! Your new Resend account
              successfully processed this test email.
            </p>

            <p>
              Your email integration is working.
            </p>

            <hr />

            <small style="color: #777;">
              This is an automated test email.
            </small>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("❌ EMAIL FAILED!");
      console.error(error);
      return;
    }

    console.log("✅ EMAIL REQUEST ACCEPTED!");
    console.log("Email ID:", data.id);
    console.log("Check your inbox and spam folder.");
  } catch (err) {
    console.error("❌ Unexpected Error:", err.message);
  }
}

sendTestEmail();
