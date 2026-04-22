const PDFDocument = require("pdfkit");

const COLORS = {
  forest: "#1e3d2f",
  cream: "#f6f1e8",
  terracotta: "#c45c3e",
  ink: "#1c1915",
  muted: "#4a443a",
  warm: "#e8a090",
  sand: "#ebe3d2",
};

/**
 * @param {object} o
 * @param {string} o.fullName
 * @param {string} o.ticketCode
 * @param {string} o.attendanceType
 * @param {number} o.ticketPriceNaira
 * @param {string} o.eventName
 * @param {string} o.venueLine
 * @param {string} o.txRef
 * @returns {Promise<Buffer>}
 */
function buildAsaliTicketPdfBuffer({
  fullName,
  ticketCode,
  attendanceType,
  ticketPriceNaira,
  eventName,
  venueLine,
  txRef,
}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      info: { Title: "Cavemen Africa — Asali ticket", Author: "Cavemen Africa" },
    });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const w = doc.page.width;
    const margin = 48;
    const headerH = 108;

    doc.rect(0, 0, w, headerH).fill(COLORS.forest);
    doc
      .fillColor(COLORS.cream)
      .opacity(0.92)
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .text("CAVEMEN AFRICA", margin, 28, { width: w - 2 * margin, characterSpacing: 1.2 });
    doc
      .fillColor(COLORS.warm)
      .opacity(1)
      .font("Helvetica")
      .fontSize(7.5)
      .text("STUDIO OF STUDIOS · KANO, NORTHERN NIGERIA", margin, 44, {
        width: w - 2 * margin,
        characterSpacing: 0.6,
      });
    doc
      .fillColor("#fefdfb")
      .font("Helvetica-Bold")
      .fontSize(20)
      .text(String(eventName), margin, 64, { width: w - 2 * margin, lineGap: 2 });
    doc
      .fillColor(COLORS.cream)
      .opacity(0.88)
      .font("Helvetica-Oblique")
      .fontSize(9.5)
      .text("Where raw voices rise — a creative space in Northern Nigeria.", margin, 92, {
        width: w - 2 * margin,
      });

    let y = headerH + 32;
    doc.fillColor(COLORS.ink).font("Helvetica-Bold").fontSize(12).text(`Hi ${String(fullName)},`, margin, y);
    y += 20;
    doc
      .fillColor(COLORS.muted)
      .font("Helvetica")
      .fontSize(10)
      .text(
        "Your entry pass. Present this document or your ticket code at the door. Creative spaces work best when we show up for each other.",
        margin,
        y,
        { width: w - 2 * margin, lineGap: 3 },
      );
    y += 52;

    const boxH = 128;
    const boxW = w - 2 * margin;
    doc.save();
    doc.roundedRect(margin, y, boxW, boxH, 4).fill(COLORS.sand);
    doc.rect(margin, y, 9, boxH).fill(COLORS.terracotta);
    const innerX = margin + 24;
    doc
      .fillColor(COLORS.terracotta)
      .font("Helvetica-Bold")
      .fontSize(7.5)
      .text("ENTRY PASS", innerX, y + 16, { characterSpacing: 1.4 });
    doc.fillColor(COLORS.muted).font("Helvetica").fontSize(9).text("Code", innerX, y + 32);
    doc
      .fillColor(COLORS.forest)
      .font("Courier-Bold")
      .fontSize(24)
      .text(String(ticketCode), innerX, y + 50, { width: boxW - 48, characterSpacing: 0.5 });
    doc
      .fillColor(COLORS.forest)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(`${String(attendanceType)}  ·  N${String(ticketPriceNaira)}`, innerX, y + 90);
    doc.restore();

    y += boxH + 28;
    doc
      .fillColor(COLORS.muted)
      .font("Helvetica")
      .fontSize(8.5)
      .text(venueLine, margin, y, { width: w - 2 * margin, align: "center" });
    y += 20;
    doc
      .fillColor(COLORS.terracotta)
      .font("Helvetica")
      .fontSize(7.5)
      .text(`Reference: ${String(txRef)}`, margin, y, { width: w - 2 * margin, align: "center" });
    y += 28;
    doc
      .fillColor(COLORS.muted)
      .font("Helvetica-Oblique")
      .fontSize(7)
      .text("Cavemen Africa · CAVEMEN IMPACT SOLUTIONS LTD", margin, y, { width: w - 2 * margin, align: "center" });

    doc.end();
  });
}

module.exports = { buildAsaliTicketPdfBuffer };
