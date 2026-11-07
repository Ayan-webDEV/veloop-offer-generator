# VELoop Offer Letter Generator – implementation notes

## Implemented in this update

- Added daily Resend channel allocation in MongoDB: Channel 1 gets attempts 1–100, Channel 2 gets attempts 101–200, then email generation/sending is paused until midnight Asia/Kolkata. Every attempt reserves its counter and creates a `pending` email event before calling Resend; provider outcomes update that same event to `sent` or `failed`.
- Added public read-only `/api/email-usage` for the homepage meter and admin dashboard.
- Added a blue/white channel-usage panel to the offer home page and admin overview, plus a new **Email & Settings** admin page.
- Added a 1.7-second channel-switch overlay when the UI detects Channel 1 is full and Channel 2 becomes active.
- Added Brevo WhatsApp-group reminder queue with a default 150-minute delay. Jobs persist in MongoDB and a backend worker checks for due reminders every minute. The admin can enable/disable the reminder and edit sender name/address, reply-to, delay, subject and the complete HTML template. A live preview is provided.
- Added admin endpoints to edit and delete intern records.
- Added an intern details editor and delete action in the details modal.
- Added a per-row offer-letter PDF download action. It fetches the selected intern's saved details and generates the PDF locally using the existing offer PDF builder; no PDF is stored on the server.
- Changed the UI accent from orange to blue and added a consistent white/blue palette.
- New Intern IDs are generated as `VLRINT` + year + five-digit sequence. Legacy four-digit sequence IDs are migrated at startup by inserting a zero after the year. For example, `VLRINT20262618` becomes `VLRINT202602618`.
- Startup sequence recovery reads existing intern records and advances the counter to the highest existing sequence. Admin can adjust the next sequence in **Email & Settings**.

## Render environment variables

Set these in Render's backend service environment (not in Vite/browser variables):

- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `RESEND_API_KEY_2`, `RESEND_FROM_EMAIL_2`
- `RESEND_REPLY_TO` (optional)
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `BREVO_REPLY_TO`
- Existing values: `MONGODB_URI`, `MONGODB_DB_NAME`, `DASHBOARD_PASSWORD`, `INTERN_VERIFICATION_API_KEY`, `PORT`

The admin reminder settings page also stores the verified Brevo sender address and template in MongoDB. The Brevo API key remains server-side.

## Deployment / behavior notes

- The application-level Resend counters are independent of provider-reported usage. They count offer-send attempts, not provider dashboard totals. Keep both Resend keys and sender identities valid and verified.
- The quota is per IST calendar day: 100 Channel 1 attempts + 100 Channel 2 attempts. The UI meter refreshes periodically and after sending.
- A delayed reminder is sent only when the automation is enabled, a Brevo API key exists, and a verified Brevo sender email has been configured in Admin → Email & Settings.
- The reminder worker runs while the Render service process is awake. If the service sleeps/restarts at the scheduled time, the persistent job is processed when the service is running again; delivery can be delayed.
- The offer verification endpoint continues to accept both legacy and new 15-character Intern IDs during migration compatibility.
- The requested attendance-side **Reverify intern** workflow is intentionally a follow-on task: it belongs in the separate attendance portal and should be implemented after this offer-letter update is deployed and validated.

## Validation

- `node --check server.cjs` passes.
- Frontend production build could not be run in this environment because dependency installation timed out and the npm cache did not contain the required packages (`npm ci --offline` reports `ENOTCACHED`). Run `npm ci` and `npm run build` locally or in CI before deploying.
