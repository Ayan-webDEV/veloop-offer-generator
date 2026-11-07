# VELoop Rewards Offer Letter Generator

This version uses the supplied `demo_alpha.pdf` as the actual PDF template. It does **not** rasterize the template to PNG for generation, so the downloaded offer letter remains vector/sharp.

## Install

```bash
npm install
npm run dev
```

## Template behavior

- The original PDF artwork, icons, QR, logo, signature, stamp and footer remain in the source PDF.
- The supplied PDF intentionally leaves the first opening line blank. The application writes that missing line using the embedded Calibri/Calibri Bold fonts extracted from the source PDF.
- The following `VELOOP REWARDS...` paragraph lines are untouched.
- Intern name is automatically uppercased.
- Issue date is automatically the current date in Asia/Kolkata.
- Start date is selected separately.
- Intern ID is generated locally in sequence.
- Stipend is fixed to `UnPaid`.


## Email channels and automatic WhatsApp reminder

Add these variables to Render (server environment only):

- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` for Channel 1.
- `RESEND_API_KEY_2` and `RESEND_FROM_EMAIL_2` for Channel 2.
- `BREVO_API_KEY` for the WhatsApp-group reminder.
- `DASHBOARD_PASSWORD`, `MONGODB_URI`, `MONGODB_DB_NAME`, and `INTERN_VERIFICATION_API_KEY` as already required by your deployment.

The Resend allocator counts every attempted offer email, including pending/failed provider outcomes. It uses Channel 1 for attempts 1–100 and Channel 2 for attempts 101–200, then pauses email sending until midnight Asia/Kolkata. Usage counters are stored in MongoDB and are reset by using a new IST date-key each day. This application-level counter does not query Resend's actual provider usage; ensure each API key belongs to an account with sufficient quota and that the From address is verified for that account.

In the admin dashboard, open **Email & Settings** to set the verified Brevo sender address, reminder subject, HTML, delay, and next Intern ID sequence. The default reminder delay is 150 minutes. HTML template variables supported: `{{name}}`, `{{email}}`, `{{internId}}`, and `{{whatsappLink}}`.

### Brevo setup

1. Create/sign in to your Brevo account and complete sender/domain authentication.
2. In Brevo, open **Settings → SMTP & API → API Keys** (menu wording can vary) and create a v3 API key.
3. Add that key to Render as `BREVO_API_KEY`; never add it to Vite variables or frontend source.
4. Verify the sender email address in Brevo.
5. In the VELoop admin dashboard, open **Email & Settings** and enter the exact verified sender email and sender name.
6. Save the settings. The worker checks due reminder jobs once per minute and sends via Brevo after the configured delay.

The worker queue is persisted in MongoDB, so due jobs remain available after a Render restart. Render must remain running for the reminder to be processed. A free instance that sleeps/restarts can delay the reminder until the backend wakes up. The scheduler is application-level and runs only while this service is running.

## Intern ID format

New IDs use `VLRINT` + four-digit year + five-digit sequence (for example `VLRINT202602619`). At backend startup, legacy four-digit sequence IDs are migrated by inserting a leading zero after the year; email-event and reminder references are migrated with them. Review MongoDB backups before deploying this migration to production.
