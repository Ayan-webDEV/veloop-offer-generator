import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
// import fontkit from "@pdf-lib/fontkit";
import "./styles.css";

const IST = "Asia/Kolkata";
const TEMPLATE_URL = "/offer-template.pdf";

const DEFAULT_EMAIL_SUBJECT =
  "Congratulations! You Have Been Shortlisted – Internship Offer Letter Attached";

const DEFAULT_WHATSAPP_LINK = "";

const CREATE_INTERN_ENDPOINT = "/api/create-intern";
const EMAIL_API_ENDPOINT = "/api/send-offer";

function buildOfferEmailHtml({ name, whatsappLink }) {
  const safeName = escapeHtml(name);
  const safeWhatsApp = escapeHtml(whatsappLink);

  return `
<!doctype html>
<html>
<head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

      body,
      table,
      td,
      div,
      p,
      h1,
      h2,
      h3,
      span,
      a {
        font-family: 'Poppins', Arial, Helvetica, sans-serif;
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f4f7fb;font-family:'Poppins',Arial,Helvetica,sans-serif;color:#172033;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Your VELoop Rewards internship offer letter is attached for your review.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;background:#ffffff;border:1px solid #e6eaf0;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="background:#101827;padding:28px 34px;">
                <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:.4px;">
                  VELOOP <span style="color:#f16b05;">REWARDS</span>
                </div>
                <div style="margin-top:6px;color:#cbd5e1;font-size:13px;">
                  Internship Program · Official Communication
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:38px 34px 20px;">
                <div style="font-size:15px;color:#536174;margin-bottom:12px;">
                  Dear ${safeName},
                </div>

                <h1 style="margin:0 0 18px;font-size:25px;line-height:1.3;color:#172033;">
                  Congratulations! 🎊
                </h1>

                <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#435067;">
                  We are pleased to inform you that you have been shortlisted
                  and selected for the <strong style="color:#172033;">VELoop Rewards Internship Program</strong>.
                </p>

                <div style="margin:24px 0;padding:20px;border:1px solid #e8edf3;border-radius:10px;background:#f8fafc;">
                  <div style="font-size:14px;font-weight:700;color:#172033;margin-bottom:7px;">
                    Your Internship Offer Letter
                  </div>
                  <div style="font-size:14px;line-height:1.65;color:#5b677a;">
                    Your official offer letter is attached to this email.
                    Please review it carefully and keep it for your records.
                  </div>
                </div>

                <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#435067;">
                  To confirm your acceptance, kindly reply to this email with
                  <strong style="color:#172033;">"I Accept"</strong>.
                </p>

                <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#435067;">
                  After accepting the offer, please join our official WhatsApp
                  community for important updates, announcements, and onboarding information.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 28px;">
                  <tr>
                    <td style="border-radius:8px;background:#f16b05;">
                      <a href="${safeWhatsApp}" target="_blank" style="display:inline-block;padding:13px 22px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">
                        Join Official WhatsApp Group
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 8px;font-size:14px;line-height:1.7;color:#5b677a;">
                  If you have any questions, feel free to contact us at:
                </p>

                <p style="margin:0 0 26px;font-size:14px;">
                  <a href="mailto:arinceofficial.co@gmail.com" style="color:#f16b05;text-decoration:none;font-weight:700;">
                    arinceofficial.co@gmail.com
                  </a>
                </p>

                <p style="margin:0 0 22px;font-size:15px;line-height:1.75;color:#435067;">
                  We look forward to welcoming you to the VELoop Rewards team
                  and wish you a successful internship journey.
                </p>

                <p style="margin:0;font-size:14px;line-height:1.7;color:#435067;">
                  Best Regards,<br>
                  <strong style="color:#172033;">Team VELoop Rewards</strong>
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 34px;background:#f8fafc;border-top:1px solid #e8edf3;">
                <div style="font-size:11px;line-height:1.6;color:#7a8698;">
                  This email and its attachment constitute official internship communication from VELoop Rewards.
                  Please keep the attached offer letter for your records.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
const DOMAIN_OPTIONS = [
  "Frontend Development Intern",
  "Backend Development Intern",
  "Full Stack Development Intern",
  "UI/UX Design Intern",
  "Graphic Design Intern",
  "Digital Marketing Intern",
  "Content Writing Intern",
  "SEO Intern",
  "Data Analysis Intern",
];

const PAGE_W = 595.32;
const PAGE_H = 841.92;
const ORANGE = rgb(241 / 255, 107 / 255, 5 / 255);
const BLACK = rgb(0, 0, 0);
const WHITE = rgb(1, 1, 1);

function todayISTISO() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function formatDateInput(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function cover(page, x, top, width, height) {
  page.drawRectangle({
    x,
    y: PAGE_H - top - height,
    width,
    height,
    color: WHITE,
  });
}

function drawTextTop(page, text, x, top, font, size, color = BLACK) {
  page.drawText(text, {
    x,
    y: PAGE_H - top - size * 0.75,
    font,
    size,
    color,
  });
}

function drawRightTextTop(page, text, right, top, font, size, color = BLACK) {
  const width = font.widthOfTextAtSize(text, size);
  drawTextTop(page, text, right - width, top, font, size, color);
}

function fitFirstLine(fontRegular, fontBold, position) {
  const preferredSize = 12.96;

  const prefix = "We are pleased to offer you the position of ";

  const suffix = " at";

  const x = 48;
  const maxRight = 555;
  const maxWidth = maxRight - x;

  /*
   * Extra spacing between "of" and the dynamic position.
   */
  const positionGap = 7;

  let current = preferredSize;

  while (current >= 10.5) {
    const prefixWidth = fontRegular.widthOfTextAtSize(prefix, current);

    const positionWidth = fontBold.widthOfTextAtSize(position, current);

    const suffixWidth = fontRegular.widthOfTextAtSize(suffix, current);

    const totalWidth = prefixWidth + positionGap + positionWidth + suffixWidth;

    if (totalWidth <= maxWidth) {
      return current;
    }

    current -= 0.25;
  }

  return 10.5;
}

async function buildPdf(data) {
  const templateBytes = await fetch(TEMPLATE_URL).then((r) => r.arrayBuffer());

  const pdf = await PDFDocument.load(templateBytes);

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const page = pdf.getPages()[0];

  const name = (data.name || "INTERN NAME").trim().toUpperCase();

  const position = (data.position || "Frontend Development Intern").trim();

  const internId = data.internId || "VLRINT20260001";

  const issue = formatDateInput(data.issueDate);
  const start = formatDateInput(data.startDate);

  const duration = data.duration || "1 Month";
  const mode = data.mode || "Remote";

  /*
   * ============================================================
   * FIRST OPENING LINE
   * ============================================================
   *
   * The supplied PDF already contains the following lines:
   *
   * VELOOP REWARDS. We were impressed...
   * we believe you will be...
   *
   * Therefore we only generate the missing FIRST line.
   *
   * IMPORTANT:
   * The dynamic position starts AFTER the measured width of
   * the complete prefix. It is NOT hard-coded to x=279 anymore.
   */

  const firstLineSize = fitFirstLine(regular, bold, position);

  const prefix = "We are pleased to offer you the position of";

  const suffix = " at";

  const x = 48;
  const top = 300.53;

  /*
   * Calculate exactly where the word after "of" should start.
   *
   * +7 gives the visual spacing required because Helvetica's
   * metrics are slightly different from the font used in the
   * original template.
   */
  const prefixWidth = regular.widthOfTextAtSize(prefix, firstLineSize);

  const positionX = x + prefixWidth + 7;

  /*
   * Draw the normal opening text.
   */
  drawTextTop(page, prefix, x, top, regular, firstLineSize);

  /*
   * Draw the dynamic position in bold.
   */
  drawTextTop(page, position, positionX, top, bold, firstLineSize);

  /*
   * Draw " at" immediately after the dynamic position.
   */
  const positionWidth = bold.widthOfTextAtSize(position, firstLineSize);

  drawTextTop(
    page,
    suffix,
    positionX + positionWidth,
    top,
    regular,
    firstLineSize,
  );

  /*
   * ============================================================
   * ISSUE DATE
   * ============================================================
   */

  cover(page, 437, 198, 120, 22);

  drawRightTextTop(page, issue, 555.2, 203.06, bold, 12.96);

  /*
   * ============================================================
   * RECIPIENT NAME
   * ============================================================
   */

  cover(page, 46, 217, 180, 21);

  drawTextTop(page, name, 48, 221.12, bold, 14.52, ORANGE);

  /*
   * ============================================================
   * INTERN ID
   * ============================================================
   */

  cover(page, 46, 238, 185, 20);

  drawTextTop(page, `ID:  ${internId}`, 48, 241.25, bold, 12.96);

  /*
   * ============================================================
   * GREETING NAME
   * ============================================================
   */

  cover(page, 78, 268, 190, 21);

  drawTextTop(page, name, 80.064, 271.52, bold, 14.52, ORANGE);

  /*
   * ============================================================
   * OFFER DETAILS
   * ============================================================
   */

  /*
   * Position
   */
  cover(page, 224, 437, 335, 20);

  drawTextTop(page, position, 227.21, 440.59, regular, 12);

  /*
   * Start Date
   */
  cover(page, 224, 463, 335, 20);

  drawTextTop(page, start, 227.21, 466.03, regular, 12);

  /*
   * Duration
   */
  cover(page, 224, 489, 335, 20);

  drawTextTop(page, duration, 227.21, 492.31, bold, 12);

  /*
   * Mode
   */
  cover(page, 224, 515, 335, 20);

  drawTextTop(page, mode, 227.21, 518.59, bold, 12);

  /*
   * Stipend
   * Fixed as UnPaid.
   */
  cover(page, 224, 541, 335, 20);

  drawTextTop(page, "UnPaid", 227.21, 544.78, bold, 11.04);

  /*
   * ============================================================
   * SAVE PDF
   * ============================================================
   */

  return await pdf.save({
    useObjectStreams: false,
  });
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function App() {
  const [data, setData] = useState(() => ({
    name: "",
    email: "",
    position: "",
    issueDate: todayISTISO(),
    startDate: todayISTISO(),
    duration: "1 Month",
    mode: "Remote",
    internId: "",
    subject: DEFAULT_EMAIL_SUBJECT,
    whatsappLink: DEFAULT_WHATSAPP_LINK,
  }));

  const [pdfUrl, setPdfUrl] = useState("");
  const [generatedPdfBase64, setGeneratedPdfBase64] = useState("");
  const [generatedFileName, setGeneratedFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [toast, setToast] = useState({
    visible: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setData((current) => ({ ...current, issueDate: todayISTISO() }));
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({
      visible: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast({
        visible: false,
        type: "success",
        message: "",
      });
    }, 3000);
  };
  const notifySuccess = (message) => {
    setSuccess(message);
    setError("");
    showToast(message, "success");
  };

  const notifyError = (message) => {
    setError(message);
    setSuccess("");
    showToast(message, "error");
  };

  const update = (key, value) => {
    setData((current) => ({ ...current, [key]: value }));
    setError("");
    setSuccess("");
  };

  const requiredFieldsFilled =
    data.name.trim() &&
    data.email.trim() &&
    data.position &&
    data.startDate &&
    data.duration &&
    data.mode &&
    data.whatsappLink.trim();

  const isOfferGenerated = Boolean(generatedPdfBase64);

  const createInternRecord = async () => {
    const requiredForDatabase =
      data.name.trim() &&
      data.email.trim() &&
      data.position &&
      data.startDate &&
      data.duration &&
      data.mode;

    if (!requiredForDatabase) {
      throw new Error(
        "Complete the intern name, email, position, start date, duration, and mode before generating an Intern ID.",
      );
    }

    const response = await fetch(CREATE_INTERN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim(),
        position: data.position,
        startDate: data.startDate,
        duration: data.duration,
        mode: data.mode,
        issueDate: data.issueDate,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result?.message || "Could not create the intern record.");
    }

    const internId = result?.intern?.internId;

    if (!internId) {
      throw new Error("The server did not return an Intern ID.");
    }

    setData((current) => ({
      ...current,
      internId,
    }));

    return internId;
  };

  const preview = async () => {
    if (!requiredFieldsFilled) {
      notifyError("Please complete all required offer and email fields first.");
      return;
    }

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const current = { ...data };

      if (!current.internId) {
        current.internId = await createInternRecord();
      }

      const bytes = await buildPdf(current);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setPdfUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return url;
      });

      const base64 = arrayBufferToBase64(bytes);

      setGeneratedPdfBase64(base64);
      setGeneratedFileName(`${current.internId}-Offer-Letter.pdf`);

      notifySuccess(
        "Offer letter generated successfully. It is now attached and ready to send.",
      );
      // showToast("Offer letter generated successfully!");
    } catch (e) {
      console.error(e);
      notifyError(e?.message || "Could not generate the offer letter.");
    } finally {
      setBusy(false);
    }
  };

  const sendOfferLetter = async () => {
    if (!isOfferGenerated) {
      notifyError("Generate the offer letter before sending it.");
      return;
    }

    if (!requiredFieldsFilled) {
      notifyError("Please complete all required fields before sending.");
      return;
    }

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(EMAIL_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          internId: data.internId,
          recipientEmail: data.email.trim(),
          recipientName: data.name.trim().toUpperCase(),
          subject: data.subject.trim(),
          whatsappLink: data.whatsappLink.trim(),
          pdfBase64: generatedPdfBase64,
          fileName: generatedFileName,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result?.message || "The offer letter could not be sent.",
        );
      }

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      setPdfUrl("");
      setGeneratedPdfBase64("");
      setGeneratedFileName("");

      setData((prev) => ({
        ...prev,
        // Only the recipient-specific fields are cleared after a successful send.
        // Position, start date, duration, mode, WhatsApp link, and other
        // reusable settings remain unchanged for the next offer.
        name: "",
        email: "",
        // A new offer must receive a new MongoDB-backed Intern ID.
        // Keeping the old ID would risk sending the next offer with a duplicate ID.
        internId: "",
      }));

      notifySuccess(
        "Offer letter sent successfully. Name and email were cleared; the remaining form settings were kept for the next intern.",
      );
      // showToast("Offer letter sent successfully!");
    } catch (e) {
      console.error(e);
      notifyError(e?.message || "Could not send the offer letter.");
    } finally {
      setBusy(false);
    }
  };

  const assignId = async () => {
    if (data.internId || busy) return;

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const internId = await createInternRecord();
      notifySuccess(`Intern ID ${internId} generated and saved to MongoDB.`);
    } catch (e) {
      console.error(e);
      notifyError(e?.message || "Could not generate the Intern ID.");
    } finally {
      setBusy(false);
    }
  };

  const bodyPreview = useMemo(
    () =>
      buildOfferEmailHtml({
        name: data.name || "Intern",
        whatsappLink: data.whatsappLink || DEFAULT_WHATSAPP_LINK,
      }),
    [data.name, data.whatsappLink],
  );

  return (
    <main className="app">
      {toast.visible && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>

          <div className="toast-content">
            <strong>{toast.type === "success" ? "Success" : "Notice"}</strong>

            <span>{toast.message}</span>
          </div>

          <button
            type="button"
            className="toast-close"
            onClick={() =>
              setToast({
                visible: false,
                type: "success",
                message: "",
              })
            }
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      <header className="topbar">
        <div>
          <div className="brand">
            VELOOP <span>REWARDS</span>
          </div>
          <p>Internship Offer Letter Generator</p>
        </div>
        <div className="template-badge">VECTOR PDF TEMPLATE</div>
      </header>

      <section className="workspace">
        <aside className="panel form-panel">
          <div className="panel-heading">
            <h1>Offer Details</h1>
            <p>
              Enter the intern information. The original PDF artwork remains
              untouched.
            </p>
          </div>

          <div className="form-grid">
            <Field label="Intern Name">
              <input
                value={data.name}
                onChange={(e) => update("name", e.target.value.toUpperCase())}
                placeholder="AYAN ALAM"
              />
            </Field>

            <Field label="Recipient Email">
              <input
                type="email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="intern@example.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Position / Domain">
              <select
                value={data.position}
                onChange={(e) => update("position", e.target.value)}
              >
                <option value="" disabled>
                  Select Position / Domain
                </option>

                {DOMAIN_OPTIONS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Intern ID">
              <div className="id-row">
                <input
                  value={data.internId}
                  readOnly
                  placeholder="Generated with offer"
                />
                <button
                  type="button"
                  className="small-btn"
                  onClick={assignId}
                  disabled={busy || Boolean(data.internId)}
                >
                  {busy && !isOfferGenerated ? "Generating…" : "Generate"}
                </button>
              </div>
            </Field>

            <Field label="Issue Date (IST)">
              <input value={data.issueDate} readOnly />
            </Field>

            <Field label="Start Date">
              <input
                type="date"
                value={data.startDate}
                onChange={(e) => update("startDate", e.target.value)}
              />
            </Field>

            <Field label="Duration">
              <select
                value={data.duration}
                onChange={(e) => update("duration", e.target.value)}
              >
                <option value="" disabled>
                  Select Duration
                </option>
                <option>1 Month</option>
                <option>2 Months</option>
                <option>3 Months</option>
                <option>6 Months</option>
              </select>
            </Field>

            <Field label="Mode">
              <select
                value={data.mode}
                onChange={(e) => update("mode", e.target.value)}
              >
                <option value="" disabled>
                  Select Mode
                </option>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </Field>

            <Field label="Stipend">
              <input value="UnPaid" readOnly />
            </Field>

            <Field label="Email Subject">
              <input type="text" value={DEFAULT_EMAIL_SUBJECT} readOnly />
            </Field>

            <Field label="WhatsApp Community Link">
              <input
                type="url"
                value={data.whatsappLink}
                onChange={(e) => update("whatsappLink", e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
              />
            </Field>
          </div>

          <div className="notice">
            <strong>
              {isOfferGenerated ? "Offer Ready to Send" : "Email Workflow"}
            </strong>
            <span>
              {isOfferGenerated
                ? "The generated PDF is attached to the pending email. Review the preview, then send the offer."
                : "Generate the PDF first. It will be attached automatically when you send the offer letter."}
            </span>
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="email-preview-card">
            <div className="email-preview-header">
              <div>
                <strong>Email Body Preview</strong>
                <span>Personalized automatically from the form</span>
              </div>
            </div>

            <div
              className="email-body-preview"
              dangerouslySetInnerHTML={{ __html: bodyPreview }}
            />
          </div>

          <div className="actions">
            <button
              className="secondary"
              onClick={preview}
              disabled={busy || !requiredFieldsFilled || isOfferGenerated}
            >
              {busy && !isOfferGenerated
                ? "Generating…"
                : isOfferGenerated
                  ? "Offer Letter Generated"
                  : "Generate Offer Letter"}
            </button>

            <button
              className="primary"
              onClick={sendOfferLetter}
              disabled={busy || !isOfferGenerated}
            >
              {busy && isOfferGenerated ? "Sending…" : "Send Offer Letter"}
            </button>
          </div>
        </aside>

        <section className="panel preview-panel">
          <div className="preview-heading">
            <div>
              <h2>Live Preview</h2>
              <p>Rendered from the original PDF template at PDF quality.</p>
            </div>
            <span>ONE PAGE · A4</span>
          </div>

          <div className="pdf-frame-wrap">
            {pdfUrl ? (
              <iframe
                title="VELoop Rewards Offer Letter Preview"
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                className="pdf-frame"
              />
            ) : (
              <div className="empty-preview">
                <div className="empty-icon">PDF</div>
                <h3>Preview will appear here</h3>
                <p>
                  Complete the form, then generate the offer letter to preview
                  it here.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
