import React, { useCallback, useEffect, useMemo, useState } from "react";

import OfferForm from "./OfferForm.jsx";
import PdfPreview from "./PdfPreview.jsx";
import EmailBodyPreview from "./EmailBodyPreview.jsx";

import { apiPost } from "../../services/api.js";
import { arrayBufferToBase64, buildPdf } from "../../utils/pdf.js";
import { todayISTISO } from "../../utils/dates.js";

const CREATE_INTERN_ENDPOINT = "/api/create-intern";
const EMAIL_API_ENDPOINT = "/api/send-offer";

const DEFAULT_EMAIL_SUBJECT =
  "Congratulations! You Have Been Shortlisted – Internship Offer Letter Attached";

const DEFAULT_WHATSAPP_LINK = "";

const DEFAULT_STIPEND = "Performance Based — Up to ₹6,000";

const INITIAL_DATA = () => ({
  name: "",
  email: "",
  position: "",
  issueDate: todayISTISO(),
  startDate: "",
  duration: "1 Month",
  mode: "Remote",
  stipend: DEFAULT_STIPEND,
  internId: "",
  subject: DEFAULT_EMAIL_SUBJECT,
  whatsappLink: DEFAULT_WHATSAPP_LINK,
});

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function validateWhatsAppLink(value) {
  if (!String(value || "").trim()) return false;

  try {
    const url = new URL(value.trim());

    return (
      url.protocol === "https:" &&
      [
        "chat.whatsapp.com",
        "www.chat.whatsapp.com",
        "wa.me",
        "www.wa.me",
        "api.whatsapp.com",
      ].includes(url.hostname.toLowerCase()) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function revokeBlobUrl(url) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-600">
            {eyebrow}
          </p>
        )}

        <h1 className="text-xl font-extrabold tracking-tight text-ink-950 sm:text-2xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function FeedbackMessage({ type = "error", children, onDismiss }) {
  if (!children) return null;

  const styles = {
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-6 ${styles[type] || styles.info}`}
    >
      <span aria-hidden="true" className="mt-0.5 shrink-0 font-bold">
        {type === "error" ? "!" : type === "success" ? "✓" : "i"}
      </span>

      <p className="min-w-0 flex-1">{children}</p>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md px-1 text-lg leading-5 opacity-70 hover:opacity-100"
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  );
}

function StepIndicator({ number, title, description, active, complete }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
          complete
            ? "bg-emerald-100 text-emerald-700"
            : active
              ? "bg-brand-600 text-black shadow-sm shadow-brand-600/20"
              : "border border-line bg-white text-ink-500"
        }`}
      >
        {complete ? "✓" : number}
      </span>

      <div className="min-w-0 pt-0.5">
        <p
          className={`text-sm font-bold ${
            active || complete ? "text-ink-950" : "text-ink-500"
          }`}
        >
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-ink-500">{description}</p>
      </div>
    </div>
  );
}

export default function OfferGenerator() {
  const [data, setData] = useState(INITIAL_DATA);
  const [pdfUrl, setPdfUrl] = useState("");
  const [generatedPdfBase64, setGeneratedPdfBase64] = useState("");
  const [generatedFileName, setGeneratedFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setData((current) => ({
        ...current,
        issueDate: todayISTISO(),
      }));
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => revokeBlobUrl(pdfUrl);
  }, [pdfUrl]);

  const update = useCallback((key, value) => {
    setData((current) => ({
      ...current,
      [key]: value,
    }));

    setError("");
    setSuccess("");
    setToast("");
  }, []);

  const requiredFieldsFilled = Boolean(
    data.name.trim() &&
    validateEmail(data.email) &&
    data.position &&
    data.startDate &&
    data.duration &&
    data.mode &&
    data.whatsappLink.trim() &&
    validateWhatsAppLink(data.whatsappLink),
  );

  const isOfferGenerated = Boolean(generatedPdfBase64);

  const createInternRecord = async () => {
    const result = await apiPost(CREATE_INTERN_ENDPOINT, {
      name: data.name.trim().toUpperCase(),
      email: data.email.trim(),
      position: data.position,
      startDate: data.startDate,
      duration: data.duration,
      mode: data.mode,
      stipend: data.stipend,
      issueDate: data.issueDate,
    });

    const internId = result?.intern?.internId;

    if (!internId) {
      throw new Error("The server did not return an Intern ID.");
    }

    return internId;
  };

  const generateOffer = async () => {
    if (!data.name.trim()) {
      setError("Enter the intern's full name.");
      return;
    }

    if (!validateEmail(data.email)) {
      setError("Enter a valid recipient email address.");
      return;
    }

    if (!data.position || !data.startDate || !data.duration || !data.mode) {
      setError("Complete the position, start date, duration, and mode.");
      return;
    }

    if (!validateWhatsAppLink(data.whatsappLink)) {
      setError(
        "Enter a valid HTTPS WhatsApp community link before generating the offer.",
      );
      return;
    }

    setBusy(true);
    setError("");
    setSuccess("");
    setToast("");

    try {
      let current = { ...data };

      if (!current.internId) {
        const internId = await createInternRecord();

        current = {
          ...current,
          internId,
        };

        setData((previous) => ({
          ...previous,
          internId,
        }));
      }

      const bytes = await buildPdf(current);
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "application/pdf" }),
      );

      const base64 = arrayBufferToBase64(bytes);
      const filename = `${current.internId}-Offer-Letter.pdf`;

      setPdfUrl(url);
      setGeneratedPdfBase64(base64);
      setGeneratedFileName(filename);

      setSuccess(
        "Offer letter generated successfully. Review the PDF before sending it.",
      );
    } catch (cause) {
      console.error("Offer generation failed:", cause);
      setError(cause?.message || "Could not generate the offer letter.");
    } finally {
      setBusy(false);
    }
  };

  const sendOfferLetter = async () => {
    if (!isOfferGenerated) {
      setError("Generate the offer letter before sending it.");
      return;
    }

    if (!requiredFieldsFilled) {
      setError("Review the required fields before sending the offer.");
      return;
    }

    setBusy(true);
    setError("");
    setSuccess("");
    setToast("");

    try {
      await apiPost(EMAIL_API_ENDPOINT, {
        internId: data.internId,
        recipientEmail: data.email.trim(),
        recipientName: data.name.trim().toUpperCase(),
        subject: data.subject.trim() || DEFAULT_EMAIL_SUBJECT,
        whatsappLink: data.whatsappLink.trim(),
        pdfBase64: generatedPdfBase64,
        fileName: generatedFileName,
      });

      setData((previous) => ({
        ...previous,
        name: "",
        email: "",
        internId: "",
        issueDate: todayISTISO(),
      }));

      setPdfUrl("");
      setGeneratedPdfBase64("");
      setGeneratedFileName("");

      setSuccess(
        "The email provider accepted the send request. Check email history for the recorded result.",
      );

      setToast("Offer email submitted successfully.");
    } catch (cause) {
      console.error("Offer email submission failed:", cause);
      setError(cause?.message || "Could not send the offer letter.");
    } finally {
      setBusy(false);
    }
  };

  const downloadOffer = useCallback(() => {
    if (!pdfUrl || !generatedFileName) {
      setError("Generate the offer letter before downloading it.");
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = pdfUrl;
    anchor.download = generatedFileName;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setToast("Download started.");
  }, [pdfUrl, generatedFileName]);

  const discardOffer = () => {
    setPdfUrl("");
    setGeneratedPdfBase64("");
    setGeneratedFileName("");
    setError("");
    setSuccess("");
    setToast("");

    // The intern record remains in the database if one was already created.
    setData((previous) => ({
      ...previous,
      internId: "",
    }));
  };

  const assignId = async () => {
    if (data.internId || busy) return;

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const internId = await createInternRecord();

      setData((previous) => ({
        ...previous,
        internId,
      }));

      setToast(`Intern ID assigned: ${internId}`);
    } catch (cause) {
      console.error("Intern ID assignment failed:", cause);
      setError(cause?.message || "Could not assign an Intern ID.");
    } finally {
      setBusy(false);
    }
  };

  const bodyPreview = useMemo(
    () => ({
      name: data.name,
      whatsappLink: data.whatsappLink,
    }),
    [data.name, data.whatsappLink],
  );

  const offerComplete = Boolean(data.internId && isOfferGenerated);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Internship operations
          </div>

          <h1 className="text-3xl font-black tracking-tight text-ink-950 sm:text-4xl lg:text-[42px]">
            Offer letter <span className="text-brand-600">studio.</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-500 sm:text-base">
            Create a personalized internship offer, review the original PDF
            template, and send the official letter from one workspace.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
          <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500">
              Issue date
            </p>
            <p className="mt-2 text-sm font-extrabold text-ink-950">
              {data.issueDate || "Not available"}
            </p>
            <p className="mt-1 text-[11px] text-ink-500">India Standard Time</p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500">
              Offer status
            </p>
            <p className="mt-2 text-sm font-extrabold text-ink-950">
              {offerComplete ? "Ready to send" : "In preparation"}
            </p>
            <p className="mt-1 text-[11px] text-ink-500">
              {offerComplete ? "PDF generated" : "Complete the workflow"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-2xl border border-line bg-white p-4 shadow-card sm:grid-cols-3 sm:p-5">
        <StepIndicator
          number="01"
          title="Enter details"
          description="Recipient and internship information"
          active={!data.internId}
          complete={Boolean(data.internId)}
        />

        <StepIndicator
          number="02"
          title="Generate and review"
          description="Create and inspect the PDF"
          active={Boolean(data.internId) && !isOfferGenerated}
          complete={isOfferGenerated}
        />

        <StepIndicator
          number="03"
          title="Send offer"
          description="Submit the email with the PDF attached"
          active={isOfferGenerated}
          complete={false}
        />
      </div>

      <div className="mb-5 space-y-3">
        <FeedbackMessage type="error" onDismiss={() => setError("")}>
          {error}
        </FeedbackMessage>

        <FeedbackMessage type="success" onDismiss={() => setSuccess("")}>
          {success}
        </FeedbackMessage>

        <FeedbackMessage type="info" onDismiss={() => setToast("")}>
          {toast}
        </FeedbackMessage>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <div className="p-5 sm:p-7">
            <SectionHeading
              eyebrow="Step 01"
              title="Offer details"
              description="Complete the required fields. Your PDF will use the original offer-letter artwork."
              action={
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Secure workflow
                </span>
              }
            />

            <div className="mt-6">
              <OfferForm
                data={data}
                onChange={update}
                onAssignId={assignId}
                onGenerate={generateOffer}
                onSend={sendOfferLetter}
                onDownload={downloadOffer}
                onDiscard={discardOffer}
                busy={busy}
                isOfferGenerated={isOfferGenerated}
                requiredFieldsFilled={requiredFieldsFilled}
                error={error}
                success={success}
              />
            </div>
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <div className="p-5 sm:p-7">
            <SectionHeading
              eyebrow="Step 02"
              title="Document preview"
              description="Inspect the generated PDF before sending the offer to the intern."
              action={
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1.5 text-[10px] font-bold text-ink-700">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      d="M7 3.75h7l4.25 4.5v12A.75.75 0 0 1 17.5 21h-10a.75.75 0 0 1-.75-.75V4.5A.75.75 0 0 1 7.5 3.75Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M14 4v5h4M9 13h6M9 16h6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  PDF DOCUMENT
                </span>
              }
            />

            <div className="mt-6">
              <PdfPreview
                pdfUrl={pdfUrl}
                filename={generatedFileName || "Offer-Letter.pdf"}
                isGenerated={isOfferGenerated}
                onDownload={downloadOffer}
              />
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="p-5 sm:p-7">
          <SectionHeading
            eyebrow="Email communication"
            title="Recipient email preview"
            description="Check the recipient greeting and community link before sending."
          />

          <div className="mt-6">
            <EmailBodyPreview {...bodyPreview} />
          </div>
        </div>
      </section>

      <footer className="mt-8 flex flex-col gap-2 border-t border-line py-5 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-bold text-ink-700">VELOOP REWARDS</span> ·
          Internship operations workspace
        </p>

        <p>Review the offer letter before sending it.</p>
      </footer>
    </div>
  );
}
