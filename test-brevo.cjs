require("dotenv").config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME =
  process.env.BREVO_SENDER_NAME || "Team VELoop Rewards";

const TEST_EMAIL = process.argv[2] || process.env.BREVO_TEST_EMAIL;

async function testBrevo() {
  console.log("\n======================================");
  console.log("       VELOOP BREVO CONNECTION TEST");
  console.log("======================================\n");

  // Check configuration.
  if (!BREVO_API_KEY) {
    console.error("FAILED: BREVO_API_KEY is missing in .env");
    process.exit(1);
  }

  if (!BREVO_SENDER_EMAIL) {
    console.error("FAILED: BREVO_SENDER_EMAIL is missing in .env");
    process.exit(1);
  }

  if (!TEST_EMAIL || !/^\S+@\S+\.\S+$/.test(TEST_EMAIL)) {
    console.error("FAILED: Provide a valid recipient email.");
    console.log('Usage: node test-brevo.cjs "your-email@example.com"');
    process.exit(1);
  }

  console.log("Configuration:");
  console.log("Brevo API key: Present");
  console.log("Sender:", BREVO_SENDER_EMAIL);
  console.log("Recipient:", TEST_EMAIL);
  console.log("\nConnecting to Brevo SMTP API...\n");

  const payload = {
    sender: {
      email: BREVO_SENDER_EMAIL,
      name: BREVO_SENDER_NAME,
    },
    to: [
      {
        email: TEST_EMAIL,
      },
    ],
    subject: "VELoop Rewards - Brevo Integration Test",
    htmlContent: `
      <div style="font-family:Arial,sans-serif;padding:25px;color:#172554">
        <h2 style="color:#2563eb">Brevo Integration Successful!</h2>
        <p>Hello,</p>
        <p>This is a test email from the VELoop Rewards Offer Letter Generator.</p>
        <p>If you received this email, your Brevo API integration
        successfully accepted the email request.</p>
        <hr />
        <p style="font-size:12px;color:#64748b">
          VELoop Rewards - Automated Email Test
        </p>
      </div>
    `,
    textContent:
      "Brevo Integration Successful! This is a test email from VELoop Rewards.",
    tags: ["veloop-brevo-integration-test"],
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    console.log("HTTP Status:", response.status);

    if (!response.ok) {
      console.error("\nBREVO TEST FAILED");
      console.error("Error:", result.message || "Unknown Brevo error");
      console.error("Details:", result);
      process.exitCode = 1;
      return;
    }

    console.log("\n======================================");
    console.log("          BREVO TEST PASSED");
    console.log("======================================");
    console.log("Brevo accepted the test email.");
    console.log("Message ID:", result.messageId || "Not returned");
    console.log("Recipient:", TEST_EMAIL);
    console.log("\nCheck your inbox and spam folder.");
    console.log("======================================\n");
  } catch (error) {
    console.error("\nBREVO CONNECTION ERROR");
    console.error(error.message);
    process.exitCode = 1;
  }
}

testBrevo();
