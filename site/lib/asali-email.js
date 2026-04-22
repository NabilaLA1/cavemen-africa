const nodemailer = require("nodemailer");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildTicketEmailHtml({
  recipientName,
  ticketCode,
  attendanceType,
  amountNaira,
  eventName,
}) {
  const safeName = escapeHtml(recipientName);
  const safeCode = escapeHtml(ticketCode);
  const safeType = escapeHtml(attendanceType);
  const safeEvent = escapeHtml(eventName);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your ticket</title>
</head>
<body style="margin:0;font-family:Georgia,serif;background:#f6f1e8;color:#1c1915;line-height:1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1e8;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #d4c9b5;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 8px;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#9e4328;font-weight:700;">Payment confirmed</p>
              <h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;">${safeEvent}</h1>
              <p style="margin:0;font-size:15px;color:#4a443a;">Hi ${safeName},</p>
              <p style="margin:14px 0 0;font-size:15px;color:#4a443a;">
                Thank you for your payment. Your ticket is below—please keep this email or save your ticket code for entry.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;">
              <div style="border:1px dashed #c45c3e;border-radius:12px;padding:18px 16px;background:rgba(30,61,47,0.06);text-align:center;">
                <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#4a443a;">Ticket code</p>
                <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.06em;color:#1e3d2f;font-family:ui-monospace,Menlo,Consolas,monospace;">${safeCode}</p>
                <p style="margin:14px 0 0;font-size:14px;color:#4a443a;">
                  <strong>${safeType}</strong> · N${escapeHtml(String(amountNaira))}
                </p>
              </div>
              <p style="margin:18px 0 0;font-size:13px;color:#6b6358;">
                Cavemen Africa · No 2 Guda Abdullahi Road, Farm Center, Kano, Nigeria
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function createMailTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

async function sendTicketEmail(transport, { to, subject, html, text }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transport.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
}

function buildTicketEmailText({
  recipientName,
  ticketCode,
  attendanceType,
  amountNaira,
  eventName,
}) {
  return [
    `Hi ${recipientName},`,
    "",
    `Your payment for ${eventName} was successful.`,
    "",
    `Ticket code: ${ticketCode}`,
    `Type: ${attendanceType} · N${amountNaira}`,
    "",
    "Please keep this email for your records.",
    "",
    "Cavemen Africa · Kano, Nigeria",
  ].join("\n");
}

module.exports = {
  buildTicketEmailHtml,
  buildTicketEmailText,
  createMailTransport,
  escapeHtml,
  sendTicketEmail,
};
