// require("dotenv").config();
// // // const fs = require("fs");
// // const path = require("path");
// // const crypto = require("crypto");

// // const PORT = Number(process.env.PORT || 8787);
// // const BREVO_API_KEY = process.env.BREVO_API_KEY;
// // const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
// // const BREVO_SENDER_NAME =
// //   process.env.BREVO_SENDER_NAME || "Team VELoop Rewards";
// // const BREVO_REPLY_TO = process.env.BREVO_REPLY_TO || BREVO_SENDER_EMAIL;

// const EMAIL_PROVIDER = String(process.env.EMAIL_PROVIDER || "resend")
//   .trim()
//   .toLowerCase();

// // function sendJson(res, status, payload) {
// //   res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
// //   res.end(JSON.stringify(payload));
// // }

// // function escapeHtml(value = "") {
// //   return String(value)
// //     .replaceAll("&", "&amp;")
// //     .replaceAll("<", "&lt;")
// //     .replaceAll(">", "&gt;")
// //     .replaceAll('"', "&quot;")
// //     .replaceAll("'", "&#039;");
// // }

// // function buildEmailHtml({ name, whatsappLink }) {
// //   const safeName = escapeHtml(name);
// //   const safeWhatsApp = escapeHtml(whatsappLink);

// //   return `<!doctype html>
// // <html>
// // <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">
// //   <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your VELoop Rewards internship offer letter is attached for your review.</div>
// //   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb;padding:32px 12px;">
// //     <tr><td align="center">
// //       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;background:#fff;border:1px solid #e6eaf0;border-radius:14px;overflow:hidden;">
// //         <tr><td style="background:#101827;padding:28px 34px;">
// //           <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:.4px;">VELOOP <span style="color:#f16b05;">REWARDS</span></div>
// //           <div style="margin-top:6px;color:#cbd5e1;font-size:13px;">Internship Program · Official Communication</div>
// //         </td></tr>
// //         <tr><td style="padding:38px 34px 20px;">
// //           <div style="font-size:15px;color:#536174;margin-bottom:12px;">Dear ${safeName},</div>
// //           <h1 style="margin:0 0 18px;font-size:25px;line-height:1.3;color:#172033;">Congratulations! 🎊</h1>
// //           <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#435067;">We are pleased to inform you that you have been shortlisted and selected for the <strong style="color:#172033;">VELoop Rewards Internship Program</strong>.</p>
// //           <div style="margin:24px 0;padding:20px;border:1px solid #e8edf3;border-radius:10px;background:#f8fafc;">
// //             <div style="font-size:14px;font-weight:700;color:#172033;margin-bottom:7px;">Your Internship Offer Letter</div>
// //             <div style="font-size:14px;line-height:1.65;color:#5b677a;">Your official offer letter is attached to this email. Please review it carefully and keep it for your records.</div>
// //           </div>
// //           <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#435067;">To confirm your acceptance, kindly reply to this email with <strong style="color:#172033;">"I Accept"</strong>.</p>
// //           <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#435067;">After accepting the offer, please join our official WhatsApp community for important updates, announcements, and onboarding information:</p>
// //           <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 28px;"><tr><td style="border-radius:8px;background:#f16b05;"><a href="${safeWhatsApp}" target="_blank" style="display:inline-block;padding:13px 22px;color:#fff;text-decoration:none;font-size:14px;font-weight:700;">Join Official WhatsApp Community</a></td></tr></table>
// //           <p style="margin:0 0 8px;font-size:14px;line-height:1.7;color:#5b677a;">If you have any questions, feel free to contact us at:</p>
// //           <p style="margin:0 0 26px;font-size:14px;"><a href="mailto:arinceofficial.co@gmail.com" style="color:#f16b05;text-decoration:none;font-weight:700;">arinceofficial.co@gmail.com</a></p>
// //           <p style="margin:0 0 22px;font-size:15px;line-height:1.75;color:#435067;">We look forward to welcoming you to the VELoop Rewards team and wish you a successful internship journey.</p>
// //           <p style="margin:0;font-size:14px;line-height:1.7;color:#435067;">Best Regards,<br><strong style="color:#172033;">Team VELoop Rewards</strong></p>
// //         </td></tr>
// //         <tr><td style="padding:18px 34px;background:#f8fafc;border-top:1px solid #e8edf3;"><div style="font-size:11px;line-height:1.6;color:#7a8698;">This email and its attachment constitute official internship communication from VELoop Rewards. Please keep the attached offer letter for your records.</div></td></tr>
// //       </table>
// //     </td></tr>
// //   </table>
// // </body>
// // </html>`;
// // }

// // function readBody(req) {
// //   return new Promise((resolve, reject) => {
// //     let body = "";
// //     req.on("data", (chunk) => {
// //       body += chunk;
// //       if (body.length > 12 * 1024 * 1024) {
// //         reject(new Error("Request body is too large."));
// //         req.destroy();
// //       }
// //     });
// //     req.on("end", () => {
// //       try {
// //         resolve(JSON.parse(body || "{}"));
// //       } catch {
// //         reject(new Error("Invalid JSON body."));
// //       }
// //     });
// //     req.on("error", reject);
// //   });
// // }

// // async function sendOffer(req, res) {
// //   if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
// //     return sendJson(res, 500, {
// //       message:
// //         "Brevo is not configured. Set BREVO_API_KEY and BREVO_SENDER_EMAIL in .env.",
// //     });
// //   }

// //   let body;
// //   try {
// //     body = await readBody(req);
// //   } catch (e) {
// //     return sendJson(res, 400, { message: e.message });
// //   }

// //   const recipientEmail = String(body.recipientEmail || "").trim();
// //   const recipientName = String(body.recipientName || "").trim();
// //   const subject = String(body.subject || "").trim();
// //   const whatsappLink = String(body.whatsappLink || "").trim();
// //   const pdfBase64 = String(body.pdfBase64 || "").trim();
// //   const fileName = String(
// //     body.fileName || "VELoop-Rewards-Offer-Letter.pdf",
// //   ).trim();

// //   if (!/^\S+@\S+\.\S+$/.test(recipientEmail))
// //     return sendJson(res, 400, {
// //       message: "Please provide a valid recipient email address.",
// //     });
// //   if (!recipientName)
// //     return sendJson(res, 400, { message: "Recipient name is required." });
// //   if (!subject)
// //     return sendJson(res, 400, { message: "Email subject is required." });
// //   if (!/^https:\/\/chat\.whatsapp\.com\//i.test(whatsappLink))
// //     return sendJson(res, 400, {
// //       message: "Please provide a valid WhatsApp community link.",
// //     });
// //   if (!pdfBase64)
// //     return sendJson(res, 400, {
// //       message: "Generated offer letter attachment is missing.",
// //     });
// //   if (Buffer.byteLength(pdfBase64, "utf8") > 8 * 1024 * 1024)
// //     return sendJson(res, 400, {
// //       message: "Offer letter attachment is too large.",
// //     });

// //   const payload = {
// //     sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
// //     replyTo: { email: BREVO_REPLY_TO, name: BREVO_SENDER_NAME },
// //     to: [{ email: recipientEmail, name: recipientName }],
// //     subject,
// //     htmlContent: buildEmailHtml({ name: recipientName, whatsappLink }),
// //     textContent: `Dear ${recipientName},\n\nCongratulations!\n\nWe are pleased to inform you that you have been shortlisted and selected for the VELoop Rewards Internship Program.\n\nYour Offer Letter is attached to this email. Please review it carefully and keep it for your records.\n\nTo confirm your acceptance, kindly reply to this email with "I Accept".\n\nAfter accepting the offer, please join our official WhatsApp community: ${whatsappLink}\n\nIf you have any questions, contact arinceofficial.co@gmail.com.\n\nBest Regards,\nTeam VELoop Rewards`,
// //     attachment: [{ content: pdfBase64, name: fileName }],
// //     tags: ["veloop-internship-offer"],
// //     headers: { "Idempotency-Key": crypto.randomUUID() },
// //   };

// //   try {
// //     const response = await fetch("https://api.brevo.com/v3/smtp/email", {
// //       method: "POST",
// //       headers: {
// //         accept: "application/json",
// //         "api-key": BREVO_API_KEY,
// //         "content-type": "application/json",
// //       },
// //       body: JSON.stringify(payload),
// //     });

// //     const result = await response.json().catch(() => ({}));
// //     if (!response.ok) {
// //       return sendJson(res, response.status, {
// //         message: result?.message || "Brevo rejected the email.",
// //       });
// //     }

// //     return sendJson(res, 200, {
// //       ok: true,
// //       messageId: result?.messageId || null,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     return sendJson(res, 502, { message: "Could not reach Brevo." });
// //   }
// // }

// // const server = http.createServer(async (req, res) => {
// //   if (req.method === "POST" && req.url === "/api/send-offer") {
// //     return sendOffer(req, res);
// //   }

// //   if (req.method === "GET" && req.url === "/api/health") {
// //     return sendJson(res, 200, { ok: true });
// //   }

// //   sendJson(res, 404, { message: "Not found." });
// // });

// // server.listen(PORT, () => {
// //   console.log(`VELoop email server running on http://localhost:${PORT}`);
// // });
// require("dotenv").config();
// const { Resend } = require("resend");
// const express = require("express");
// const crypto = require("crypto");
// const path = require("path");

// const { MongoClient, ServerApiVersion } = require("mongodb");

// const PORT = Number(process.env.PORT || 8787);
// const resend = new Resend(process.env.RESEND_API_KEY);
// const BREVO_API_KEY = process.env.BREVO_API_KEY;
// const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;

// const BREVO_SENDER_NAME =
//   process.env.BREVO_SENDER_NAME || "Team VELoop Rewards";

// const BREVO_REPLY_TO = process.env.BREVO_REPLY_TO || BREVO_SENDER_EMAIL;

// const MONGODB_URI = process.env.MONGODB_URI;
// const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "veloop_offers";

// /*
// |--------------------------------------------------------------------------
// | Existing Intern ID configuration
// |--------------------------------------------------------------------------
// |
// | If your last already-assigned ID is:
// |
// | VLRINT20260037
// |
// | then set:
// |
// | INTERN_ID_START_NUMBER=38
// |
// */

// const INTERN_ID_START_NUMBER = Math.max(
//   1,
//   Number(process.env.INTERN_ID_START_NUMBER || 1),
// );

// let mongoClient;
// let database;
// let internsCollection;
// let countersCollection;

// /*
// |--------------------------------------------------------------------------
// | MongoDB
// |--------------------------------------------------------------------------
// */

// async function connectMongoDB() {
//   if (!MONGODB_URI) {
//     throw new Error("MONGODB_URI is missing in .env");
//   }

//   mongoClient = new MongoClient(MONGODB_URI, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     },

//     tls: true,

//     family: 4,

//     serverSelectionTimeoutMS: 15000,

//     connectTimeoutMS: 15000,

//     maxPoolSize: 10,
//     waitQueueTimeoutMS: 10000,
//     socketTimeoutMS: 15000,
//     retryWrites: true,
//   });

//   await mongoClient.connect();

//   database = mongoClient.db(MONGODB_DB_NAME);

//   internsCollection = database.collection("interns");
//   countersCollection = database.collection("counters");

//   /*
//    * Make internId unique.
//    */
//   await internsCollection.createIndex({ internId: 1 }, { unique: true });

//   /*
//    * Make email searchable.
//    */
//   await internsCollection.createIndex({
//     email: 1,
//   });

//   /*
//    * Create the counter if it does not exist.
//    *
//    * IMPORTANT:
//    *
//    * If the current last assigned ID is:
//    *
//    * VLRINT20260037
//    *
//    * INTERN_ID_START_NUMBER should be 38.
//    */
//   await countersCollection.updateOne(
//     { _id: "internId" },
//     {
//       $setOnInsert: {
//         lastNumber: INTERN_ID_START_NUMBER - 1,
//         year: new Date().getFullYear(),
//       },
//     },
//     { upsert: true, maxTimeMS: 10000 },
//   );

//   await database.command({ ping: 1 });

//   console.log(`MongoDB connected: ${MONGODB_DB_NAME}`);
// }

// /*
// |--------------------------------------------------------------------------
// | JSON helpers
// |--------------------------------------------------------------------------
// */

// function sendJson(res, status, payload) {
//   return res.status(status).json(payload);
// }

// function escapeHtml(value = "") {
//   return String(value)
//     .replaceAll("&", "&amp;")
//     .replaceAll("<", "&lt;")
//     .replaceAll(">", "&gt;")
//     .replaceAll('"', "&quot;")
//     .replaceAll("'", "&#039;");
// }

// function readBody(req) {
//   return new Promise((resolve, reject) => {
//     let body = "";

//     req.on("data", (chunk) => {
//       body += chunk;

//       if (body.length > 12 * 1024 * 1024) {
//         reject(new Error("Request body is too large."));
//         req.destroy();
//       }
//     });

//     req.on("end", () => {
//       try {
//         resolve(JSON.parse(body || "{}"));
//       } catch {
//         reject(new Error("Invalid JSON body."));
//       }
//     });

//     req.on("error", reject);
//   });
// }

// /*
// |--------------------------------------------------------------------------
// | Intern ID generator
// |--------------------------------------------------------------------------
// */

// async function generateNextInternId() {
//   const currentYear = new Date().getFullYear();

//   /*
//    * Atomically increase the counter.
//    *
//    * This is important because two computers could generate an ID
//    * at almost exactly the same time.
//    *
//    * MongoDB guarantees the atomic update.
//    */
//   const result = await countersCollection.findOneAndUpdate(
//     {
//       _id: "internId",
//       year: currentYear,
//     },
//     {
//       $inc: {
//         lastNumber: 1,
//       },
//     },
//     {
//       returnDocument: "after",
//       upsert: true,
//       maxTimeMS: 10000,
//     },
//   );

//   const counter = result;

//   if (!counter || !Number.isInteger(counter.lastNumber)) {
//     throw new Error("Could not generate the next Intern ID.");
//   }

//   return `VLRINT${currentYear}${String(counter.lastNumber).padStart(4, "0")}`;
// }

// /*
// |--------------------------------------------------------------------------
// | Create intern record
// |--------------------------------------------------------------------------
// */

// async function createIntern(req, res) {
//   // Express has already parsed JSON with express.json().
//   // Do NOT read the request stream again here; doing so can wait forever.
//   const body = req.body || {};

//   const name = String(body.name || "").trim();
//   const email = String(body.email || "").trim();
//   const position = String(body.position || "").trim();
//   const startDate = String(body.startDate || "").trim();
//   const duration = String(body.duration || "").trim();
//   const mode = String(body.mode || "").trim();
//   const issueDate = String(body.issueDate || "").trim();

//   const stipend = String(body.stipend || "").trim();

//   if (!name) {
//     return sendJson(res, 400, {
//       message: "Intern name is required.",
//     });
//   }

//   if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
//     return sendJson(res, 400, {
//       message: "A valid intern email is required.",
//     });
//   }

//   if (!position) {
//     return sendJson(res, 400, {
//       message: "Internship domain is required.",
//     });
//   }

//   if (!startDate) {
//     return sendJson(res, 400, {
//       message: "Start date is required.",
//     });
//   }

//   if (!duration) {
//     return sendJson(res, 400, {
//       message: "Duration is required.",
//     });
//   }

//   if (!mode) {
//     return sendJson(res, 400, {
//       message: "Mode is required.",
//     });
//   }
//   if (!stipend) {
//     return sendJson(res, 400, {
//       message: "Stipend is required.",
//     });
//   }

//   try {
//     /*
//      * Generate a unique ID from MongoDB.
//      */
//     const internId = await generateNextInternId();

//     const document = {
//       internId,

//       name: name.toUpperCase(),

//       email,

//       domain: position,

//       startDate,

//       duration,

//       mode,

//       stipend,

//       issueDate,

//       offerCreatedAt: new Date(),

//       offerSent: false,

//       offerSentAt: null,
//     };

//     await internsCollection.insertOne(document, { maxTimeMS: 10000 });

//     return sendJson(res, 201, {
//       ok: true,
//       message: "Intern created successfully.",
//       intern: {
//         internId,
//         name: document.name,
//         email: document.email,
//         domain: document.domain,
//         startDate: document.startDate,
//         duration: document.duration,
//         mode: document.mode,
//         stipend: document.stipend,
//         issueDate: document.issueDate,
//       },
//     });
//   } catch (error) {
//     console.error("CREATE INTERN ERROR:", error);

//     return sendJson(res, 500, {
//       message: error?.message || "Could not create intern record.",
//     });
//   }
// }

// /*
// |--------------------------------------------------------------------------
// | Mark offer as sent
// |--------------------------------------------------------------------------
// */

// async function markOfferAsSent(req, res) {
//   // Express has already parsed JSON with express.json().
//   const body = req.body || {};
//   const internId = String(body.internId || "").trim();

//   if (!internId) {
//     return sendJson(res, 400, {
//       message: "Intern ID is required.",
//     });
//   }

//   try {
//     const result = await internsCollection.updateOne(
//       { internId },
//       {
//         $set: {
//           offerSent: true,
//           offerSentAt: new Date(),
//         },
//       },
//       { maxTimeMS: 10000 },
//     );

//     if (result.matchedCount === 0) {
//       return sendJson(res, 404, {
//         message: "Intern record not found.",
//       });
//     }

//     return sendJson(res, 200, {
//       ok: true,
//       message: "Offer marked as sent.",
//     });
//   } catch (error) {
//     console.error("MARK OFFER SENT ERROR:", error);

//     return sendJson(res, 500, {
//       message: "Could not update intern record.",
//     });
//   }
// }

// /*
// |--------------------------------------------------------------------------
// | Brevo email HTML
// |--------------------------------------------------------------------------
// */

// function buildEmailHtml({ name, whatsappLink }) {
//   const safeName = escapeHtml(name);
//   const safeWhatsApp = escapeHtml(whatsappLink);

//   return `<!doctype html>
// <html>
// <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">

//   <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
//     Your VELoop Rewards internship offer letter is attached for your review.
//   </div>

//   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb;padding:32px 12px;">
//     <tr>
//       <td align="center">

//         <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
//           style="max-width:680px;background:#fff;border:1px solid #e6eaf0;border-radius:14px;overflow:hidden;">

//           <tr>
//             <td style="background:#101827;padding:28px 34px;">
//               <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:.4px;">
//                 VELOOP <span style="color:#f16b05;">REWARDS</span>
//               </div>

//               <div style="margin-top:6px;color:#cbd5e1;font-size:13px;">
//                 Internship Program · Official Communication
//               </div>
//             </td>
//           </tr>

//           <tr>
//             <td style="padding:38px 34px 20px;">

//               <div style="font-size:15px;color:#536174;margin-bottom:12px;">
//                 Dear ${safeName},
//               </div>

//               <h1 style="margin:0 0 18px;font-size:25px;line-height:1.3;color:#172033;">
//                 Congratulations! 🎊
//               </h1>

//               <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#435067;">
//                 We are pleased to inform you that you have been shortlisted and selected for the
//                 <strong style="color:#172033;">VELoop Rewards Internship Program</strong>.
//               </p>

//               <div style="margin:24px 0;padding:20px;border:1px solid #e8edf3;border-radius:10px;background:#f8fafc;">

//                 <div style="font-size:14px;font-weight:700;color:#172033;margin-bottom:7px;">
//                   Your Internship Offer Letter
//                 </div>

//                 <div style="font-size:14px;line-height:1.65;color:#5b677a;">
//                   Your official offer letter is attached to this email.
//                   Please review it carefully and keep it for your records.
//                 </div>

//               </div>

//               <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#435067;">
//                 To confirm your acceptance, kindly reply to this email with
//                 <strong style="color:#172033;">"I Accept"</strong>.
//               </p>

//               <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#435067;">
//                 After accepting the offer, please join our official WhatsApp community
//                 for important updates, announcements, and onboarding information:
//               </p>

//               <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 28px;">
//                 <tr>
//                   <td style="border-radius:8px;background:#f16b05;">
//                     <a href="${safeWhatsApp}" target="_blank"
//                       style="display:inline-block;padding:13px 22px;color:#fff;text-decoration:none;font-size:14px;font-weight:700;">
//                       Join Official WhatsApp Community
//                     </a>
//                   </td>
//                 </tr>
//               </table>

//               <p style="margin:0 0 8px;font-size:14px;line-height:1.7;color:#5b677a;">
//                 If you have any questions, feel free to contact us at:
//               </p>

//               <p style="margin:0 0 26px;font-size:14px;">
//                 <a href="mailto:arinceofficial.co@gmail.com"
//                   style="color:#f16b05;text-decoration:none;font-weight:700;">
//                   arinceofficial.co@gmail.com
//                 </a>
//               </p>

//               <p style="margin:0 0 22px;font-size:15px;line-height:1.75;color:#435067;">
//                 We look forward to welcoming you to the VELoop Rewards team
//                 and wish you a successful internship journey.
//               </p>

//               <p style="margin:0;font-size:14px;line-height:1.7;color:#435067;">
//                 Best Regards,<br>
//                 <strong style="color:#172033;">Team VELoop Rewards</strong>
//               </p>

//             </td>
//           </tr>

//           <tr>
//             <td style="padding:18px 34px;background:#f8fafc;border-top:1px solid #e8edf3;">
//               <div style="font-size:11px;line-height:1.6;color:#7a8698;">
//                 This email and its attachment constitute official internship communication
//                 from VELoop Rewards. Please keep the attached offer letter for your records.
//               </div>
//             </td>
//           </tr>

//         </table>

//       </td>
//     </tr>
//   </table>

// </body>
// </html>`;
// }

// /*
// |--------------------------------------------------------------------------
// | Email provider sending
// |--------------------------------------------------------------------------
// |
// | Switch providers from .env:
// | EMAIL_PROVIDER=resend
// | EMAIL_PROVIDER=brevo
// |
// | Resend is the default. The original Brevo implementation is preserved.
// |--------------------------------------------------------------------------
// */

// async function parseOfferRequest(req) {
//   // Express has already parsed JSON with express.json().
//   // Reading the raw request stream here would hang because the stream
//   // has already been consumed by Express middleware.
//   const body = req.body || {};

//   const recipientEmail = String(body.recipientEmail || "").trim();
//   const recipientName = String(body.recipientName || "").trim();
//   const subject = String(body.subject || "").trim();
//   const whatsappLink = String(body.whatsappLink || "").trim();
//   const internId = String(body.internId || "").trim();
//   const pdfBase64 = String(body.pdfBase64 || "").trim();
//   const fileName = String(
//     body.fileName || "VELoop-Rewards-Offer-Letter.pdf",
//   ).trim();

//   if (!/^\S+@\S+\.\S+$/.test(recipientEmail)) {
//     throw Object.assign(
//       new Error("Please provide a valid recipient email address."),
//       { statusCode: 400 },
//     );
//   }
//   if (!recipientName) {
//     throw Object.assign(new Error("Recipient name is required."), {
//       statusCode: 400,
//     });
//   }
//   if (!subject) {
//     throw Object.assign(new Error("Email subject is required."), {
//       statusCode: 400,
//     });
//   }
//   if (!/^https:\/\/chat\.whatsapp\.com\//i.test(whatsappLink)) {
//     throw Object.assign(
//       new Error("Please provide a valid WhatsApp community link."),
//       { statusCode: 400 },
//     );
//   }
//   if (!internId) {
//     throw Object.assign(new Error("Intern ID is required."), {
//       statusCode: 400,
//     });
//   }
//   if (!pdfBase64) {
//     throw Object.assign(
//       new Error("Generated offer letter attachment is missing."),
//       { statusCode: 400 },
//     );
//   }
//   if (Buffer.byteLength(pdfBase64, "utf8") > 8 * 1024 * 1024) {
//     throw Object.assign(new Error("Offer letter attachment is too large."), {
//       statusCode: 400,
//     });
//   }

//   return {
//     recipientEmail,
//     recipientName,
//     subject,
//     whatsappLink,
//     internId,
//     pdfBase64,
//     fileName,
//   };
// }

// async function markEmailSent(internId, provider, messageId) {
//   const update = {
//     $set: {
//       offerSent: true,
//       offerSentAt: new Date(),
//       emailProvider: provider,
//     },
//   };

//   if (provider === "resend") update.$set.resendMessageId = messageId || null;
//   if (provider === "brevo") update.$set.brevoMessageId = messageId || null;

//   const result = await internsCollection.updateOne({ internId }, update, {
//     maxTimeMS: 10000,
//   });

//   if (result.matchedCount === 0) {
//     console.warn(`Email sent, but intern record was not found: ${internId}`);
//   }
// }

// async function sendOfferWithResend(body, res) {
//   if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
//     return sendJson(res, 500, {
//       message:
//         "Resend is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL in .env.",
//     });
//   }

//   const {
//     recipientEmail,
//     recipientName,
//     subject,
//     whatsappLink,
//     internId,
//     pdfBase64,
//     fileName,
//   } = body;

//   try {
//     const { data, error } = await resend.emails.send({
//       from: process.env.RESEND_FROM_EMAIL,
//       to: [recipientEmail],
//       subject,
//       html: buildEmailHtml({ name: recipientName, whatsappLink }),
//       text: `Dear ${recipientName},\n\nCongratulations!\n\nWe are pleased to inform you that you have been shortlisted and selected for the VELoop Rewards Internship Program.\n\nYour Offer Letter is attached to this email. Please review it carefully and keep it for your records.\n\nTo confirm your acceptance, kindly reply to this email with "I Accept".\n\nAfter accepting the offer, please join our official WhatsApp community:\n${whatsappLink}\n\nIf you have any questions, contact arinceofficial.co@gmail.com.\n\nBest Regards,\nTeam VELoop Rewards`,
//       ...(process.env.RESEND_REPLY_TO
//         ? { replyTo: process.env.RESEND_REPLY_TO }
//         : {}),
//       attachments: [{ content: pdfBase64, filename: fileName }],
//     });

//     if (error) {
//       console.error("RESEND ERROR:", error);
//       return sendJson(res, 500, {
//         message: error.message || "Resend rejected the email.",
//       });
//     }

//     await markEmailSent(internId, "resend", data?.id || null);

//     return sendJson(res, 200, {
//       ok: true,
//       provider: "resend",
//       message: "Offer letter sent successfully through Resend.",
//       messageId: data?.id || null,
//     });
//   } catch (error) {
//     console.error("RESEND SEND ERROR:", error);
//     return sendJson(res, 502, {
//       message: error?.message || "Could not reach Resend.",
//     });
//   }
// }

// async function sendOfferWithBrevo(body, res) {
//   if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
//     return sendJson(res, 500, {
//       message:
//         "Brevo is not configured. Set BREVO_API_KEY and BREVO_SENDER_EMAIL in .env.",
//     });
//   }

//   const {
//     recipientEmail,
//     recipientName,
//     subject,
//     whatsappLink,
//     internId,
//     pdfBase64,
//     fileName,
//   } = body;

//   const payload = {
//     sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
//     replyTo: { email: BREVO_REPLY_TO, name: BREVO_SENDER_NAME },
//     to: [{ email: recipientEmail, name: recipientName }],
//     subject,
//     htmlContent: buildEmailHtml({ name: recipientName, whatsappLink }),
//     textContent: `Dear ${recipientName},\n\nCongratulations!\n\nWe are pleased to inform you that you have been shortlisted and selected for the VELoop Rewards Internship Program.\n\nYour Offer Letter is attached to this email. Please review it carefully and keep it for your records.\n\nTo confirm your acceptance, kindly reply to this email with "I Accept".\n\nAfter accepting the offer, please join our official WhatsApp community:\n${whatsappLink}\n\nIf you have any questions, contact arinceofficial.co@gmail.com.\n\nBest Regards,\nTeam VELoop Rewards`,
//     attachment: [{ content: pdfBase64, name: fileName }],
//     tags: ["veloop-internship-offer"],
//     headers: { "Idempotency-Key": crypto.randomUUID() },
//   };

//   try {
//     const response = await fetch("https://api.brevo.com/v3/smtp/email", {
//       method: "POST",
//       headers: {
//         accept: "application/json",
//         "api-key": BREVO_API_KEY,
//         "content-type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     const result = await response.json().catch(() => ({}));

//     if (!response.ok) {
//       return sendJson(res, response.status, {
//         message: result?.message || "Brevo rejected the email.",
//       });
//     }

//     await markEmailSent(internId, "brevo", result?.messageId || null);

//     return sendJson(res, 200, {
//       ok: true,
//       provider: "brevo",
//       message: "Offer letter sent successfully through Brevo.",
//       messageId: result?.messageId || null,
//     });
//   } catch (error) {
//     console.error("BREVO SEND ERROR:", error);
//     return sendJson(res, 502, { message: "Could not reach Brevo." });
//   }
// }

// async function sendOffer(req, res) {
//   let body;

//   try {
//     body = await parseOfferRequest(req);
//   } catch (error) {
//     return sendJson(res, error.statusCode || 400, {
//       message: error.message || "Invalid offer request.",
//     });
//   }

//   if (EMAIL_PROVIDER === "resend") return sendOfferWithResend(body, res);
//   if (EMAIL_PROVIDER === "brevo") return sendOfferWithBrevo(body, res);

//   return sendJson(res, 500, {
//     message: `Unsupported EMAIL_PROVIDER "${EMAIL_PROVIDER}". Use "resend" or "brevo".`,
//   });
// }

// /*
// |--------------------------------------------------------------------------
// | Express server
// |--------------------------------------------------------------------------
// */

// const app = express();

// app.use(express.json({ limit: "12mb" }));

// /*
// |--------------------------------------------------------------------------
// | API ROUTES
// |--------------------------------------------------------------------------
// */

// app.post("/api/create-intern", async (req, res) => createIntern(req, res));

// app.post("/api/send-offer", async (req, res) => sendOffer(req, res));

// app.post("/api/mark-offer-sent", async (req, res) => markOfferAsSent(req, res));

// app.get("/api/health", (req, res) => {
//   return res.json({
//     ok: true,
//     database: Boolean(database),
//     emailProvider: EMAIL_PROVIDER,
//     mongoConnected: Boolean(database),
//     timestamp: new Date().toISOString(),
//   });
// });

// /*
// |--------------------------------------------------------------------------
// | SERVE REACT / VITE FRONTEND
// |--------------------------------------------------------------------------
// |
// | During deployment:
// |
// | npm run build
// |
// | creates:
// |
// | dist/
// | ├── index.html
// | └── assets/
// |
// | Express serves that folder.
// |
// |--------------------------------------------------------------------------
// */

// const frontendPath = path.join(__dirname, "dist");

// app.use(express.static(frontendPath));

// /*
// |--------------------------------------------------------------------------
// | REACT SPA FALLBACK
// |--------------------------------------------------------------------------
// |
// | This allows React routes to work correctly.
// |
// | IMPORTANT:
// | API routes are defined above this section, so /api/*
// | requests will not be handled by this fallback.
// |
// |--------------------------------------------------------------------------
// */

// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(frontendPath, "index.html"));
// });

// /*
// |--------------------------------------------------------------------------
// | START SERVER
// |--------------------------------------------------------------------------
// */

// async function startServer() {
//   try {
//     await connectMongoDB();

//     app.listen(PORT, () => {
//       console.log(`VELoop Express server running on port ${PORT}`);

//       console.log(`Email provider: ${EMAIL_PROVIDER}`);
//       console.log(`Frontend path: ${frontendPath}`);
//     });
//   } catch (error) {
//     console.error("SERVER STARTUP ERROR:", error);
//     process.exit(1);
//   }
// }

// startServer();

require("dotenv").config();

const path = require("path");
const crypto = require("crypto");
const express = require("express");
const { Resend } = require("resend");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

const PORT = Number(process.env.PORT || 8787);
const EMAIL_PROVIDER = String(process.env.EMAIL_PROVIDER || "resend")
  .trim()
  .toLowerCase();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "veloop_offers";

const INTERN_ID_START_NUMBER = Math.max(
  1,
  Number(process.env.INTERN_ID_START_NUMBER || 1),
);

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || "";

const resend = new Resend(process.env.RESEND_API_KEY);

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME =
  process.env.BREVO_SENDER_NAME || "Team VELoop Rewards";
const BREVO_REPLY_TO = process.env.BREVO_REPLY_TO || BREVO_SENDER_EMAIL;

const IST = "Asia/Kolkata";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

let mongoClient;
let database;
let internsCollection;
let countersCollection;
let emailEventsCollection;

// In-memory admin sessions. Sessions expire after 12 hours.
// Restarting the server invalidates all active sessions.
const adminSessions = new Map();

app.disable("x-powered-by");
app.use(express.json({ limit: "12mb" }));

// ------------------------------------------------------------
// GENERAL HELPERS
// ------------------------------------------------------------

function sendJson(res, status, payload) {
  return res.status(status).json(payload);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getISTParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    dateString: `${values.year}-${values.month}-${values.day}`,
  };
}

// India does not observe daylight-saving time.
// These bounds represent midnight in India, converted to UTC.
function getISTDayBounds(date = new Date()) {
  const { dateString } = getISTParts(date);

  const start = new Date(`${dateString}T00:00:00+05:30`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return { start, end, dateString };
}

function getISTMonthBounds(date = new Date()) {
  const { year, month } = getISTParts(date);

  const startString = `${year}-${String(month).padStart(2, "0")}-01`;
  const start = new Date(`${startString}T00:00:00+05:30`);

  const nextMonth = new Date(Date.UTC(year, month, 1));
  const nextMonthString = `${nextMonth.getUTCFullYear()}-${String(
    nextMonth.getUTCMonth() + 1,
  ).padStart(2, "0")}-01`;

  const end = new Date(`${nextMonthString}T00:00:00+05:30`);

  return { start, end, year, month };
}

function getBearerToken(req) {
  const authorization = req.headers.authorization || "";
  return authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : "";
}

function requireAdmin(req, res, next) {
  const token = getBearerToken(req);
  const expiresAt = adminSessions.get(token);

  if (!token || !expiresAt || expiresAt <= Date.now()) {
    if (token) adminSessions.delete(token);

    return sendJson(res, 401, {
      message: "Admin authentication required. Please log in again.",
    });
  }

  next();
}

function requireDatabase(res) {
  if (!database) {
    sendJson(res, 503, {
      message: "MongoDB is not connected.",
    });

    return false;
  }

  return true;
}

// ------------------------------------------------------------
// MONGODB
// ------------------------------------------------------------

async function connectMongoDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in .env");
  }

  mongoClient = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    retryWrites: true,
  });

  await mongoClient.connect();

  database = mongoClient.db(MONGODB_DB_NAME);

  internsCollection = database.collection("interns");
  countersCollection = database.collection("counters");
  emailEventsCollection = database.collection("emailSendEvents");

  await database.command({ ping: 1 });

  await internsCollection.createIndex({ internId: 1 }, { unique: true });

  await internsCollection.createIndex({ email: 1 });
  await internsCollection.createIndex({ name: 1 });
  await internsCollection.createIndex({ offerCreatedAt: -1 });
  await internsCollection.createIndex({ offerSentAt: -1 });

  await emailEventsCollection.createIndex({ sentAt: -1 });
  await emailEventsCollection.createIndex({
    status: 1,
    sentAt: -1,
  });
  await emailEventsCollection.createIndex({
    internId: 1,
    sentAt: -1,
  });

  await countersCollection.updateOne(
    { _id: "internId", year: new Date().getFullYear() },
    {
      $setOnInsert: {
        lastNumber: INTERN_ID_START_NUMBER - 1,
      },
    },
    { upsert: true },
  );

  console.log(`MongoDB connected: ${MONGODB_DB_NAME}`);
}

// ------------------------------------------------------------
// INTERN ID GENERATOR
// ------------------------------------------------------------

async function generateNextInternId() {
  const currentYear = new Date().getFullYear();
  const counterFilter = { _id: "internId", year: currentYear };

  // Initialize the counter separately: MongoDB does not allow the same field
  // to be modified by both $inc and $setOnInsert in one update operation.
  await countersCollection.updateOne(
    counterFilter,
    {
      $setOnInsert: {
        lastNumber: INTERN_ID_START_NUMBER - 1,
      },
    },
    { upsert: true },
  );

  const result = await countersCollection.findOneAndUpdate(
    counterFilter,
    { $inc: { lastNumber: 1 } },
    { returnDocument: "after" },
  );

  // MongoDB driver versions differ in whether findOneAndUpdate returns the
  // document directly or wraps it in a result object's `value` property.
  const counter = result?.value ?? result;

  if (!counter || !Number.isInteger(counter.lastNumber)) {
    throw new Error("Could not generate the next Intern ID.");
  }

  return `VLRINT${currentYear}${String(counter.lastNumber).padStart(4, "0")}`;
}

// ------------------------------------------------------------
// INTERN CREATION
// ------------------------------------------------------------

async function createIntern(req, res) {
  const body = req.body || {};

  const name = String(body.name || "").trim();
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const position = String(body.position || "").trim();
  const startDate = String(body.startDate || "").trim();
  const duration = String(body.duration || "").trim();
  const mode = String(body.mode || "").trim();
  const issueDate = String(body.issueDate || "").trim();

  const stipend = String(
    body.stipend || "Performance Based — Up to ₹6,000",
  ).trim();

  if (!name) {
    return sendJson(res, 400, { message: "Intern name is required." });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return sendJson(res, 400, {
      message: "A valid intern email is required.",
    });
  }

  if (!position || !startDate || !duration || !mode) {
    return sendJson(res, 400, {
      message: "Position, start date, duration and mode are required.",
    });
  }

  try {
    const internId = await generateNextInternId();
    const now = new Date();

    const document = {
      internId,
      name: name.toUpperCase(),
      email,
      domain: position,
      startDate,
      duration,
      mode,
      stipend,
      issueDate,
      offerCreatedAt: now,
      offerSent: false,
      offerSentAt: null,
      offerStatus: "pending",
    };

    await internsCollection.insertOne(document);

    return sendJson(res, 201, {
      ok: true,
      message: "Intern created successfully.",
      intern: {
        internId,
        name: document.name,
        email: document.email,
        domain: document.domain,
        startDate: document.startDate,
        duration: document.duration,
        mode: document.mode,
        stipend: document.stipend,
        issueDate: document.issueDate,
        offerCreatedAt: document.offerCreatedAt,
        offerStatus: document.offerStatus,
      },
    });
  } catch (error) {
    console.error("CREATE INTERN ERROR:", error);

    return sendJson(res, 500, {
      message: error?.message || "Could not create intern record.",
    });
  }
}

// ------------------------------------------------------------
// EMAIL TEMPLATE
// ------------------------------------------------------------

function buildEmailHtml({ name, whatsappLink }) {
  const safeName = escapeHtml(name);
  const safeWhatsApp = escapeHtml(whatsappLink);

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Your VELoop Rewards internship offer letter is attached for your review.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:#f4f7fb;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width:680px;background:#fff;border:1px solid #e6eaf0;border-radius:14px;overflow:hidden;">
          <tr>
            <td style="background:#101827;padding:28px 34px;">
              <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:.4px;">
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
              <h1 style="margin:0 0 18px;font-size:25px;color:#172033;">
                Congratulations! 🎊
              </h1>
              <p style="font-size:15px;line-height:1.75;color:#435067;">
                We are pleased to inform you that you have been shortlisted
                and selected for the <strong>VELoop Rewards Internship Program</strong>.
              </p>
              <div style="margin:24px 0;padding:20px;border:1px solid #e8edf3;border-radius:10px;background:#f8fafc;">
                <strong>Your Internship Offer Letter</strong>
                <p style="font-size:14px;line-height:1.65;color:#5b677a;">
                  Your official offer letter is attached. Please review it carefully
                  and keep it for your records.
                </p>
              </div>
              <p style="font-size:15px;line-height:1.75;color:#435067;">
                To confirm your acceptance, kindly reply to this email with
                <strong>"I Accept"</strong>.
              </p>
              <p style="font-size:15px;line-height:1.75;color:#435067;">
                After accepting the offer, join our official WhatsApp community
                for important updates and onboarding information.
              </p>
              <p style="margin:24px 0;">
                <a href="${safeWhatsApp}" target="_blank"
                  style="display:inline-block;padding:13px 22px;border-radius:8px;background:#f16b05;color:#fff;text-decoration:none;font-weight:700;">
                  Join Official WhatsApp Community
                </a>
              </p>
              <p style="font-size:14px;color:#5b677a;">
                Questions? Contact
                <a href="mailto:arinceofficial.co@gmail.com"
                  style="color:#f16b05;">arinceofficial.co@gmail.com</a>.
              </p>
              <p style="font-size:14px;line-height:1.7;color:#435067;">
                Best Regards,<br><strong>Team VELoop Rewards</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 34px;background:#f8fafc;border-top:1px solid #e8edf3;">
              <div style="font-size:11px;line-height:1.6;color:#7a8698;">
                Official internship communication from VELoop Rewards.
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

// ------------------------------------------------------------
// EMAIL EVENTS AND STATUS
// ------------------------------------------------------------

async function recordEmailEvent({
  internId,
  recipientEmail,
  recipientName,
  provider,
  status,
  messageId = null,
  errorMessage = null,
}) {
  const event = {
    internId,
    recipientEmail: String(recipientEmail || "").toLowerCase(),
    recipientName: recipientName || "",
    provider,
    status,
    messageId,
    errorMessage,
    sentAt: new Date(),
  };

  await emailEventsCollection.insertOne(event);
}

async function markEmailSent(internId, provider, messageId) {
  const now = new Date();

  await internsCollection.updateOne(
    { internId },
    {
      $set: {
        offerSent: true,
        offerStatus: "sent",
        offerSentAt: now,
        emailProvider: provider,
        lastEmailError: null,
        ...(provider === "resend"
          ? { resendMessageId: messageId || null }
          : {}),
        ...(provider === "brevo" ? { brevoMessageId: messageId || null } : {}),
      },
      $inc: { emailSendCount: 1 },
    },
  );
}

async function markEmailFailed(internId, errorMessage) {
  await internsCollection.updateOne(
    { internId },
    {
      $set: {
        offerStatus: "failed",
        lastEmailError: String(errorMessage || "Email sending failed"),
      },
    },
  );
}

// ------------------------------------------------------------
// EMAIL REQUEST VALIDATION
// ------------------------------------------------------------

function parseOfferRequest(req) {
  const body = req.body || {};

  const recipientEmail = String(body.recipientEmail || "").trim();
  const recipientName = String(body.recipientName || "").trim();
  const subject = String(body.subject || "").trim();
  const whatsappLink = String(body.whatsappLink || "").trim();
  const internId = String(body.internId || "").trim();
  const pdfBase64 = String(body.pdfBase64 || "").trim();

  const fileName = String(
    body.fileName || "VELoop-Rewards-Offer-Letter.pdf",
  ).trim();

  if (!/^\S+@\S+\.\S+$/.test(recipientEmail)) {
    throw Object.assign(
      new Error("Please provide a valid recipient email address."),
      { statusCode: 400 },
    );
  }

  if (!recipientName || !subject || !internId || !pdfBase64) {
    throw Object.assign(
      new Error("Name, subject, Intern ID and PDF attachment are required."),
      { statusCode: 400 },
    );
  }

  if (!/^https:\/\/chat\.whatsapp\.com\//i.test(whatsappLink)) {
    throw Object.assign(
      new Error("Please provide a valid WhatsApp community link."),
      { statusCode: 400 },
    );
  }

  if (Buffer.byteLength(pdfBase64, "utf8") > 8 * 1024 * 1024) {
    throw Object.assign(new Error("Offer letter attachment is too large."), {
      statusCode: 400,
    });
  }

  return {
    recipientEmail,
    recipientName,
    subject,
    whatsappLink,
    internId,
    pdfBase64,
    fileName,
  };
}

function buildPlainTextEmail({ recipientName, whatsappLink }) {
  return `Dear ${recipientName},

Congratulations!

We are pleased to inform you that you have been shortlisted and selected for the VELoop Rewards Internship Program.

Your Offer Letter is attached to this email. Please review it carefully and keep it for your records.

To confirm your acceptance, kindly reply to this email with "I Accept".

After accepting the offer, please join our official WhatsApp community:
${whatsappLink}

If you have any questions, contact arinceofficial.co@gmail.com.

Best Regards,
Team VELoop Rewards`;
}

// ------------------------------------------------------------
// SEND EMAIL THROUGH RESEND
// ------------------------------------------------------------

async function sendOfferWithResend(body, res) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return sendJson(res, 500, {
      message:
        "Resend is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL in .env.",
    });
  }

  const {
    recipientEmail,
    recipientName,
    subject,
    whatsappLink,
    internId,
    pdfBase64,
    fileName,
  } = body;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [recipientEmail],
      subject,
      html: buildEmailHtml({
        name: recipientName,
        whatsappLink,
      }),
      text: buildPlainTextEmail({
        recipientName,
        whatsappLink,
      }),
      ...(process.env.RESEND_REPLY_TO
        ? { replyTo: process.env.RESEND_REPLY_TO }
        : {}),
      attachments: [
        {
          content: pdfBase64,
          filename: fileName,
        },
      ],
    });

    if (error) {
      await recordEmailEvent({
        internId,
        recipientEmail,
        recipientName,
        provider: "resend",
        status: "failed",
        errorMessage: error.message,
      }).catch(console.error);

      await markEmailFailed(internId, error.message).catch(console.error);

      return sendJson(res, 500, {
        message: error.message || "Resend rejected the email.",
      });
    }

    const messageId = data?.id || null;

    await markEmailSent(internId, "resend", messageId);

    await recordEmailEvent({
      internId,
      recipientEmail,
      recipientName,
      provider: "resend",
      status: "sent",
      messageId,
    });

    return sendJson(res, 200, {
      ok: true,
      provider: "resend",
      message: "Offer letter sent successfully through Resend.",
      messageId,
    });
  } catch (error) {
    console.error("RESEND SEND ERROR:", error);

    await recordEmailEvent({
      internId,
      recipientEmail,
      recipientName,
      provider: "resend",
      status: "failed",
      errorMessage: error.message,
    }).catch(console.error);

    await markEmailFailed(internId, error.message).catch(console.error);

    return sendJson(res, 502, {
      message: error?.message || "Could not reach Resend.",
    });
  }
}

// ------------------------------------------------------------
// SEND EMAIL THROUGH BREVO
// ------------------------------------------------------------

async function sendOfferWithBrevo(body, res) {
  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
    return sendJson(res, 500, {
      message:
        "Brevo is not configured. Set BREVO_API_KEY and BREVO_SENDER_EMAIL in .env.",
    });
  }

  const {
    recipientEmail,
    recipientName,
    subject,
    whatsappLink,
    internId,
    pdfBase64,
    fileName,
  } = body;

  const payload = {
    sender: {
      email: BREVO_SENDER_EMAIL,
      name: BREVO_SENDER_NAME,
    },
    replyTo: {
      email: BREVO_REPLY_TO,
      name: BREVO_SENDER_NAME,
    },
    to: [
      {
        email: recipientEmail,
        name: recipientName,
      },
    ],
    subject,
    htmlContent: buildEmailHtml({
      name: recipientName,
      whatsappLink,
    }),
    textContent: buildPlainTextEmail({
      recipientName,
      whatsappLink,
    }),
    attachment: [
      {
        content: pdfBase64,
        name: fileName,
      },
    ],
    tags: ["veloop-internship-offer"],
    headers: {
      "Idempotency-Key": crypto.randomUUID(),
    },
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

    if (!response.ok) {
      const message = result?.message || "Brevo rejected the email.";

      await recordEmailEvent({
        internId,
        recipientEmail,
        recipientName,
        provider: "brevo",
        status: "failed",
        errorMessage: message,
      }).catch(console.error);

      await markEmailFailed(internId, message).catch(console.error);

      return sendJson(res, response.status, { message });
    }

    const messageId = result?.messageId || null;

    await markEmailSent(internId, "brevo", messageId);

    await recordEmailEvent({
      internId,
      recipientEmail,
      recipientName,
      provider: "brevo",
      status: "sent",
      messageId,
    });

    return sendJson(res, 200, {
      ok: true,
      provider: "brevo",
      message: "Offer letter sent successfully through Brevo.",
      messageId,
    });
  } catch (error) {
    console.error("BREVO SEND ERROR:", error);

    await recordEmailEvent({
      internId,
      recipientEmail,
      recipientName,
      provider: "brevo",
      status: "failed",
      errorMessage: error.message,
    }).catch(console.error);

    await markEmailFailed(internId, error.message).catch(console.error);

    return sendJson(res, 502, {
      message: error?.message || "Could not reach Brevo.",
    });
  }
}

async function sendOffer(req, res) {
  let body;

  try {
    body = parseOfferRequest(req);
  } catch (error) {
    return sendJson(res, error.statusCode || 400, {
      message: error.message || "Invalid offer request.",
    });
  }

  if (EMAIL_PROVIDER === "resend") {
    return sendOfferWithResend(body, res);
  }

  if (EMAIL_PROVIDER === "brevo") {
    return sendOfferWithBrevo(body, res);
  }

  return sendJson(res, 500, {
    message: `Unsupported EMAIL_PROVIDER "${EMAIL_PROVIDER}". Use "resend" or "brevo".`,
  });
}

// ------------------------------------------------------------
// MARK OFFER SENT - COMPATIBILITY ENDPOINT
// ------------------------------------------------------------

async function markOfferAsSent(req, res) {
  const internId = String(req.body?.internId || "").trim();

  if (!internId) {
    return sendJson(res, 400, {
      message: "Intern ID is required.",
    });
  }

  try {
    const result = await internsCollection.updateOne(
      { internId },
      {
        $set: {
          offerSent: true,
          offerStatus: "sent",
          offerSentAt: new Date(),
        },
      },
    );

    if (!result.matchedCount) {
      return sendJson(res, 404, {
        message: "Intern record not found.",
      });
    }

    return sendJson(res, 200, {
      ok: true,
      message: "Offer marked as sent.",
    });
  } catch (error) {
    console.error("MARK OFFER SENT ERROR:", error);

    return sendJson(res, 500, {
      message: "Could not update intern record.",
    });
  }
}

// ------------------------------------------------------------
// ADMIN LOGIN
// ------------------------------------------------------------

app.post("/api/admin/login", (req, res) => {
  if (!DASHBOARD_PASSWORD) {
    return sendJson(res, 503, {
      message:
        "Dashboard login is not configured. Add DASHBOARD_PASSWORD to your .env file and restart the server.",
    });
  }

  const password = String(req.body?.password || "");

  const expected = Buffer.from(DASHBOARD_PASSWORD);
  const provided = Buffer.from(password);

  const valid =
    expected.length === provided.length &&
    crypto.timingSafeEqual(expected, provided);

  if (!valid) {
    return sendJson(res, 401, {
      message: "Incorrect dashboard password.",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");

  adminSessions.set(token, Date.now() + SESSION_DURATION_MS);

  return sendJson(res, 200, {
    ok: true,
    token,
    expiresIn: SESSION_DURATION_MS,
  });
});

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  adminSessions.delete(getBearerToken(req));

  return sendJson(res, 200, {
    ok: true,
    message: "Logged out successfully.",
  });
});

// ------------------------------------------------------------
// DASHBOARD STATISTICS
// ------------------------------------------------------------

app.get("/api/dashboard/stats", requireAdmin, async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const now = new Date();
    const day = getISTDayBounds(now);
    const month = getISTMonthBounds(now);

    const [
      totalInterns,
      sentInterns,
      pendingInterns,
      failedInterns,
      createdToday,
      emailsSentToday,
      emailsFailedToday,
      emailsSentThisMonth,
      upcomingStarts,
      monthlyEvents,
    ] = await Promise.all([
      internsCollection.countDocuments({}),

      internsCollection.countDocuments({
        $or: [{ offerStatus: "sent" }, { offerSent: true }],
      }),

      internsCollection.countDocuments({
        offerSent: { $ne: true },
        offerStatus: { $nin: ["failed"] },
      }),

      internsCollection.countDocuments({
        offerStatus: "failed",
      }),

      internsCollection.countDocuments({
        offerCreatedAt: {
          $gte: day.start,
          $lt: day.end,
        },
      }),

      emailEventsCollection.countDocuments({
        status: "sent",
        sentAt: {
          $gte: day.start,
          $lt: day.end,
        },
      }),

      emailEventsCollection.countDocuments({
        status: "failed",
        sentAt: {
          $gte: day.start,
          $lt: day.end,
        },
      }),

      emailEventsCollection.countDocuments({
        status: "sent",
        sentAt: {
          $gte: month.start,
          $lt: month.end,
        },
      }),

      internsCollection.countDocuments({
        startDate: {
          $gte: day.dateString,
        },
        offerSent: true,
      }),

      emailEventsCollection
        .find({
          sentAt: {
            $gte: month.start,
            $lt: month.end,
          },
        })
        .project({
          status: 1,
          sentAt: 1,
        })
        .toArray(),
    ]);

    // Build a daily trend for the current IST month.
    const dailyTrend = new Map();

    for (const event of monthlyEvents) {
      const dateString = getISTParts(event.sentAt).dateString;

      if (!dailyTrend.has(dateString)) {
        dailyTrend.set(dateString, {
          date: dateString,
          sent: 0,
          failed: 0,
        });
      }

      const entry = dailyTrend.get(dateString);

      if (event.status === "sent") entry.sent += 1;
      if (event.status === "failed") entry.failed += 1;
    }

    const trend = Array.from(dailyTrend.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    return sendJson(res, 200, {
      ok: true,
      timezone: IST,
      today: day.dateString,
      month: `${month.year}-${String(month.month).padStart(2, "0")}`,
      stats: {
        totalInterns,
        sentInterns,
        pendingInterns,
        failedInterns,
        createdToday,
        emailsSentToday,
        emailsFailedToday,
        emailsSentThisMonth,
        upcomingStarts,
      },
      dailyTrend: trend,
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);

    return sendJson(res, 500, {
      message: "Could not load dashboard statistics.",
    });
  }
});

// ------------------------------------------------------------
// INTERN LIST, SEARCH, FILTERS AND PAGINATION
// ------------------------------------------------------------

app.get("/api/interns", requireAdmin, async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const skip = (page - 1) * limit;

    const q = String(req.query.q || "").trim();
    const status = String(req.query.status || "").trim();
    const domain = String(req.query.domain || "").trim();
    const duration = String(req.query.duration || "").trim();
    const mode = String(req.query.mode || "").trim();

    const filter = {};

    if (q) {
      const expression = new RegExp(escapeRegex(q), "i");

      filter.$or = [
        { internId: expression },
        { name: expression },
        { email: expression },
      ];
    }

    if (domain) filter.domain = domain;
    if (duration) filter.duration = duration;
    if (mode) filter.mode = mode;

    if (status === "sent") {
      filter.$or = [{ offerStatus: "sent" }, { offerSent: true }];
    } else if (status === "pending") {
      filter.offerSent = { $ne: true };
      filter.offerStatus = { $nin: ["failed"] };
    } else if (status === "failed") {
      filter.offerStatus = "failed";
    }

    const [records, total] = await Promise.all([
      internsCollection
        .find(filter)
        .sort({ offerCreatedAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .project({
          _id: 0,
          internId: 1,
          name: 1,
          email: 1,
          domain: 1,
          startDate: 1,
          duration: 1,
          mode: 1,
          stipend: 1,
          issueDate: 1,
          offerCreatedAt: 1,
          offerSent: 1,
          offerSentAt: 1,
          offerStatus: 1,
          emailProvider: 1,
          emailSendCount: 1,
          lastEmailError: 1,
          resendMessageId: 1,
          brevoMessageId: 1,
        })
        .toArray(),

      internsCollection.countDocuments(filter),
    ]);

    return sendJson(res, 200, {
      ok: true,
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error("INTERN LIST ERROR:", error);

    return sendJson(res, 500, {
      message: "Could not load intern records.",
    });
  }
});

// ------------------------------------------------------------
// EMAIL EVENT HISTORY — FILTERING, PAGINATION AND SUMMARY
// ------------------------------------------------------------

app.get("/api/email-events", requireAdmin, async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "")
      .trim()
      .toLowerCase();
    const from = String(req.query.from || "").trim();
    const to = String(req.query.to || "").trim();
    const conditions = [];

    if (search) {
      const expression = new RegExp(escapeRegex(search), "i");
      conditions.push({
        $or: [
          { internId: expression },
          { recipientName: expression },
          { recipientEmail: expression },
          { provider: expression },
          { messageId: expression },
          { errorMessage: expression },
        ],
      });
    }

    if (status) {
      if (!["sent", "failed", "pending"].includes(status)) {
        return sendJson(res, 400, { message: "Invalid email event status." });
      }
      conditions.push({ status });
    }

    if (from || to) {
      const sentAt = {};
      if (from) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) {
          return sendJson(res, 400, { message: "Invalid start date." });
        }
        const startDate = new Date(`${from}T00:00:00.000Z`);
        if (Number.isNaN(startDate.getTime())) {
          return sendJson(res, 400, { message: "Invalid start date." });
        }
        sentAt.$gte = startDate;
      }
      if (to) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(to)) {
          return sendJson(res, 400, { message: "Invalid end date." });
        }
        const endDate = new Date(`${to}T23:59:59.999Z`);
        if (Number.isNaN(endDate.getTime())) {
          return sendJson(res, 400, { message: "Invalid end date." });
        }
        sentAt.$lte = endDate;
      }
      conditions.push({ sentAt });
    }

    const filter = conditions.length ? { $and: conditions } : {};
    const [events, total, sent, failed, latest] = await Promise.all([
      emailEventsCollection
        .find(filter)
        .sort({ sentAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .project({ _id: 0 })
        .toArray(),
      emailEventsCollection.countDocuments(filter),
      emailEventsCollection.countDocuments({
        $and: [filter, { status: "sent" }],
      }),
      emailEventsCollection.countDocuments({
        $and: [filter, { status: "failed" }],
      }),
      emailEventsCollection.findOne(filter, {
        sort: { sentAt: -1 },
        projection: { _id: 0, sentAt: 1 },
      }),
    ]);

    return sendJson(res, 200, {
      ok: true,
      events,
      records: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
      summary: {
        total,
        sent,
        failed,
        pending: Math.max(0, total - sent - failed),
        latestEventAt: latest?.sentAt || null,
      },
    });
  } catch (error) {
    console.error("EMAIL EVENTS ERROR:", error);
    return sendJson(res, 500, {
      message: "Could not load email event history.",
    });
  }
});

// ------------------------------------------------------------
// CSV EXPORT DATA
// ------------------------------------------------------------

app.get("/api/interns/export", requireAdmin, async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const q = String(req.query.q || "").trim();
    const status = String(req.query.status || "")
      .trim()
      .toLowerCase();
    const domain = String(req.query.domain || "").trim();
    const duration = String(req.query.duration || "").trim();
    const mode = String(req.query.mode || "").trim();
    const conditions = [];

    if (q) {
      const expression = new RegExp(escapeRegex(q), "i");
      conditions.push({
        $or: [
          { internId: expression },
          { name: expression },
          { email: expression },
        ],
      });
    }

    if (domain) conditions.push({ domain });
    if (duration) conditions.push({ duration });
    if (mode) conditions.push({ mode });

    if (status === "sent") {
      conditions.push({ $or: [{ offerStatus: "sent" }, { offerSent: true }] });
    } else if (status === "failed") {
      conditions.push({ offerStatus: "failed" });
    } else if (status === "pending") {
      conditions.push({
        offerSent: { $ne: true },
        offerStatus: { $nin: ["failed"] },
      });
    }

    const filter = conditions.length ? { $and: conditions } : {};

    const records = await internsCollection
      .find(filter)
      .sort({ offerCreatedAt: -1 })
      .limit(10000)
      .project({ _id: 0 })
      .toArray();

    return sendJson(res, 200, {
      ok: true,
      records,
      truncated: records.length === 10000,
    });
  } catch (error) {
    console.error("INTERN EXPORT ERROR:", error);

    return sendJson(res, 500, {
      message: "Could not export intern records.",
    });
  }
});

// ------------------------------------------------------------
// SINGLE INTERN DETAILS AND EMAIL HISTORY
// ------------------------------------------------------------

app.get("/api/interns/:internId", requireAdmin, async (req, res) => {
  if (!requireDatabase(res)) return;

  try {
    const internId = String(req.params.internId || "").trim();

    const intern = await internsCollection.findOne(
      { internId },
      { projection: { _id: 0 } },
    );

    if (!intern) {
      return sendJson(res, 404, {
        message: "Intern record not found.",
      });
    }

    const emailHistory = await emailEventsCollection
      .find({ internId })
      .sort({ sentAt: -1 })
      .limit(100)
      .project({ _id: 0 })
      .toArray();

    return sendJson(res, 200, {
      ok: true,
      intern,
      emailHistory,
    });
  } catch (error) {
    console.error("INTERN DETAILS ERROR:", error);

    return sendJson(res, 500, {
      message: "Could not load intern details.",
    });
  }
});

// ------------------------------------------------------------
// EXISTING APPLICATION ROUTES
// ------------------------------------------------------------

app.post("/api/create-intern", async (req, res) => {
  if (!requireDatabase(res)) return;
  return createIntern(req, res);
});

app.post("/api/send-offer", async (req, res) => {
  if (!requireDatabase(res)) return;
  return sendOffer(req, res);
});

app.post("/api/mark-offer-sent", async (req, res) => {
  if (!requireDatabase(res)) return;
  return markOfferAsSent(req, res);
});

app.get("/api/health", (req, res) => {
  return sendJson(res, 200, {
    ok: true,
    database: Boolean(database),
    mongoConnected: Boolean(database),
    emailProvider: EMAIL_PROVIDER,
    timezone: IST,
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------------------------------------
// FRONTEND STATIC FILES AND SPA FALLBACK
// ------------------------------------------------------------

const frontendPath = path.join(__dirname, "dist");

app.use(express.static(frontendPath));

app.get(/.*/, (req, res) => {
  return res.sendFile(path.join(frontendPath, "index.html"));
});

// ------------------------------------------------------------
// START SERVER
// ------------------------------------------------------------

async function startServer() {
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(
        `VELoop Offer Letter Generator running on http://localhost:${PORT}`,
      );
      console.log(`Email provider: ${EMAIL_PROVIDER}`);
      console.log(`Frontend path: ${frontendPath}`);

      if (!DASHBOARD_PASSWORD) {
        console.warn(
          "WARNING: DASHBOARD_PASSWORD is not set. Dashboard login will be unavailable.",
        );
      }
    });
  } catch (error) {
    console.error("SERVER STARTUP ERROR:", error);
    process.exit(1);
  }
}

startServer();
