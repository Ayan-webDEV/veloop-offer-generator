import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

import { formatDateInput, isValidDateInput } from "./dates.js";

const TEMPLATE_URL = "/offer-template.pdf";
const NOTO_SANS_URL = "/fonts/NotoSans-Regular.ttf";

const BLACK = rgb(0.08, 0.12, 0.19);
const ORANGE = rgb(0.94, 0.39, 0.02);
const WHITE = rgb(1, 1, 1);

const DEFAULT_STIPEND = "Performance Based — Up to ₹6,000";

async function fetchAsset(url, description) {
  let response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error(`Could not load ${description}. Check your connection.`);
  }

  if (!response.ok) {
    throw new Error(
      `${description} could not be loaded (HTTP ${response.status}). ` +
        `Check that ${url} exists in the public folder.`,
    );
  }

  const bytes = await response.arrayBuffer();

  if (!bytes.byteLength) {
    throw new Error(`${description} is empty.`);
  }

  return bytes;
}

function normalizeText(value, fallback = "") {
  return String(value ?? "").trim() || fallback;
}

function normalizeHelveticaText(value) {
  return normalizeText(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, " ");
}

function validateOffer(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Offer information is required.");
  }

  const required = {
    name: "Intern name",
    position: "Internship position",
    internId: "Intern ID",
    issueDate: "Issue date",
    startDate: "Start date",
    duration: "Duration",
    mode: "Internship mode",
  };

  for (const [key, label] of Object.entries(required)) {
    if (!normalizeText(data[key])) {
      throw new Error(`${label} is required to generate the PDF.`);
    }
  }

  if (!isValidDateInput(data.issueDate)) {
    throw new Error("Enter a valid issue date.");
  }

  if (!isValidDateInput(data.startDate)) {
    throw new Error("Enter a valid internship start date.");
  }
}

function cover(page, x, top, width, height) {
  page.drawRectangle({
    x,
    y: page.getHeight() - top - height,
    width,
    height,
    color: WHITE,
  });
}

function drawTextTop(page, text, x, top, font, size, color = BLACK) {
  page.drawText(String(text), {
    x,
    y: page.getHeight() - top - size * 0.75,
    font,
    size,
    color,
  });
}

function drawRightTextTop(page, text, right, top, font, size, color = BLACK) {
  const width = font.widthOfTextAtSize(text, size);

  drawTextTop(page, text, right - width, top, font, size, color);
}

function fitFontSize(font, text, maxWidth, preferredSize, minSize = 8) {
  let size = preferredSize;

  while (size > minSize) {
    if (font.widthOfTextAtSize(text, size) <= maxWidth) {
      return size;
    }

    size -= 0.25;
  }

  return minSize;
}

function fitTextToWidth(font, text, maxWidth, size) {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) {
    return text;
  }

  let result = text;

  while (
    result.length > 1 &&
    font.widthOfTextAtSize(`${result}…`, size) > maxWidth
  ) {
    result = result.slice(0, -1);
  }

  // Helvetica cannot encode the Unicode ellipsis reliably in
  // all environments, so use three ASCII dots instead.
  while (
    result.length > 1 &&
    font.widthOfTextAtSize(`${result}...`, size) > maxWidth
  ) {
    result = result.slice(0, -1);
  }

  return `${result}...`;
}

function drawFittedText({
  page,
  text,
  x,
  top,
  font,
  preferredSize,
  minSize = 8,
  maxWidth,
  color = BLACK,
}) {
  const size = fitFontSize(font, text, maxWidth, preferredSize, minSize);

  const fittedText = fitTextToWidth(font, text, maxWidth, size);

  drawTextTop(page, fittedText, x, top, font, size, color);
}

function drawOpeningLine(page, regular, bold, position) {
  const prefix = "We are pleased to offer you the position of";
  const suffix = " at";

  const x = 48;
  const top = 300.53;
  const maxWidth = 507;
  const gap = 7;

  let size = 12.96;

  const measure = (fontSize, role) =>
    regular.widthOfTextAtSize(prefix, fontSize) +
    gap +
    bold.widthOfTextAtSize(role, fontSize) +
    regular.widthOfTextAtSize(suffix, fontSize);

  while (size > 9 && measure(size, position) > maxWidth) {
    size -= 0.25;
  }

  let fittedPosition = position;

  if (measure(size, fittedPosition) > maxWidth) {
    while (
      fittedPosition.length > 1 &&
      measure(size, `${fittedPosition}...`) > maxWidth
    ) {
      fittedPosition = fittedPosition.slice(0, -1);
    }

    fittedPosition = `${fittedPosition}...`;
  }

  drawTextTop(page, prefix, x, top, regular, size);

  const positionX = x + regular.widthOfTextAtSize(prefix, size) + gap;

  drawTextTop(page, fittedPosition, positionX, top, bold, size);

  const suffixX = positionX + bold.widthOfTextAtSize(fittedPosition, size);

  drawTextTop(page, suffix, suffixX, top, regular, size);
}

/**
 * Generates an internship offer letter using the existing
 * VELoop Rewards PDF template.
 *
 * @param {object} data
 * @returns {Promise<Uint8Array>}
 */
export async function buildPdf(data) {
  validateOffer(data);

  const [templateBytes, notoSansBytes] = await Promise.all([
    fetchAsset(TEMPLATE_URL, "Offer letter template"),
    fetchAsset(NOTO_SANS_URL, "Noto Sans font"),
  ]);

  let pdf;

  try {
    pdf = await PDFDocument.load(templateBytes);
  } catch {
    throw new Error("The offer letter template is not a valid PDF.");
  }

  pdf.registerFontkit(fontkit);

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const notoSans = await pdf.embedFont(notoSansBytes, {
    subset: true,
  });

  const page = pdf.getPages()[0];

  if (!page) {
    throw new Error("The offer letter template has no pages.");
  }

  // Coordinates below are taken from the original project.
  // They target the first page of public/offer-template.pdf.
  if (
    Math.abs(page.getWidth() - 595.28) > 10 ||
    Math.abs(page.getHeight() - 841.89) > 10
  ) {
    throw new Error(
      "Unexpected PDF template size. The existing field " +
        "coordinates require the original A4 template.",
    );
  }

  const name = normalizeHelveticaText(data.name).toUpperCase();

  const position = normalizeHelveticaText(data.position);

  const internId = normalizeHelveticaText(data.internId);

  const issueDate = formatDateInput(data.issueDate);

  const startDate = formatDateInput(data.startDate);

  const duration = normalizeHelveticaText(data.duration);

  const mode = normalizeHelveticaText(data.mode);

  const stipend = normalizeText(data.stipend, DEFAULT_STIPEND);

  // -------------------------------------------------------
  // Issue date — right aligned
  // -------------------------------------------------------

  cover(page, 437, 198, 120, 22);

  const issueSize = fitFontSize(bold, issueDate, 117, 12.96, 9);

  drawRightTextTop(page, issueDate, 555.2, 203.06, bold, issueSize);

  // -------------------------------------------------------
  // Recipient name
  // -------------------------------------------------------

  cover(page, 46, 217, 180, 21);

  drawFittedText({
    page,
    text: name,
    x: 48,
    top: 221.12,
    font: bold,
    preferredSize: 14.52,
    minSize: 9,
    maxWidth: 176,
    color: ORANGE,
  });

  // -------------------------------------------------------
  // Intern ID
  // -------------------------------------------------------

  cover(page, 46, 238, 185, 20);

  drawFittedText({
    page,
    text: `ID:  ${internId}`,
    x: 48,
    top: 241.25,
    font: bold,
    preferredSize: 12.96,
    minSize: 9,
    maxWidth: 180,
  });

  // -------------------------------------------------------
  // Greeting name
  // -------------------------------------------------------

  cover(page, 78, 268, 190, 21);

  drawFittedText({
    page,
    text: name,
    x: 80.064,
    top: 271.52,
    font: bold,
    preferredSize: 14.52,
    minSize: 9,
    maxWidth: 185,
    color: ORANGE,
  });

  // -------------------------------------------------------
  // Opening paragraph — dynamic position
  // -------------------------------------------------------

  drawOpeningLine(page, regular, bold, position);

  // -------------------------------------------------------
  // Offer details table
  // -------------------------------------------------------

  // Position
  cover(page, 224, 437, 335, 20);

  drawFittedText({
    page,
    text: position,
    x: 227.21,
    top: 440.59,
    font: regular,
    preferredSize: 12,
    minSize: 9,
    maxWidth: 327,
  });

  // Start date
  cover(page, 224, 463, 335, 20);

  drawFittedText({
    page,
    text: startDate,
    x: 227.21,
    top: 466.03,
    font: regular,
    preferredSize: 12,
    minSize: 9,
    maxWidth: 327,
  });

  // Duration
  cover(page, 224, 489, 335, 20);

  drawFittedText({
    page,
    text: duration,
    x: 227.21,
    top: 492.31,
    font: bold,
    preferredSize: 12,
    minSize: 9,
    maxWidth: 327,
  });

  // Mode
  cover(page, 224, 515, 335, 20);

  drawFittedText({
    page,
    text: mode,
    x: 227.21,
    top: 518.59,
    font: bold,
    preferredSize: 12,
    minSize: 9,
    maxWidth: 327,
  });

  // -------------------------------------------------------
  // Stipend — Unicode font supports the rupee symbol.
  // -------------------------------------------------------

  cover(page, 224, 541, 335, 20);

  drawFittedText({
    page,
    text: stipend,
    x: 227.21,
    top: 544.78,
    font: notoSans,
    preferredSize: 11.04,
    minSize: 8.5,
    maxWidth: 327,
  });

  return pdf.save({
    useObjectStreams: false,
  });
}

/**
 * Converts generated PDF bytes to base64 for the email API.
 */
export function arrayBufferToBase64(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);

  const chunkSize = 8192;
  const chunks = [];

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);

    let binary = "";

    for (let i = 0; i < chunk.length; i += 1) {
      binary += String.fromCharCode(chunk[i]);
    }

    chunks.push(binary);
  }

  return btoa(chunks.join(""));
}

/**
 * Creates a browser preview URL for a generated PDF.
 * Remember to revoke this URL when it is no longer needed.
 */
export function createPdfPreviewUrl(bytes) {
  const blob = new Blob([bytes], {
    type: "application/pdf",
  });

  return URL.createObjectURL(blob);
}

/**
 * Downloads generated PDF bytes without contacting the server.
 */
export function downloadPdf(
  bytes,
  filename = "VELoop-Internship-Offer-Letter.pdf",
) {
  const url = createPdfPreviewUrl(bytes);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export default buildPdf;
