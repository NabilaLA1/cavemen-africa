const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const {
  buildTicketEmailHtml,
  buildTicketEmailText,
  createMailTransport,
  sendTicketEmail,
} = require("./lib/asali-email");

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const databasePath = path.join(root, "data", "cavemen.db");
const productsSeedPath = path.join(root, "data", "kanti-products.json");
const asaliPaymentLinksPath = path.join(root, "data", "asali-payment-links.json");

const publicBaseUrl = String(process.env.PUBLIC_SITE_URL || `http://localhost:${port}`).replace(
  /\/$/,
  "",
);
const eventNameDefault = process.env.ASALI_EVENT_NAME || "Asali Poetry Sessions 9.0";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

if (!fs.existsSync(asaliPaymentLinksPath)) {
  fs.writeFileSync(
    asaliPaymentLinksPath,
    JSON.stringify(
      {
        Performer: "",
        Audience: "",
      },
      null,
      2,
    ),
  );
}

const database = new DatabaseSync(databasePath);
database.exec(`
  CREATE TABLE IF NOT EXISTS kanti_products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    flutterwave_url TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS asali_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    gender TEXT NOT NULL,
    discovery TEXT NOT NULL,
    attendance_type TEXT NOT NULL,
    ticket_price_naira INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

function ensureColumn(tableName, columnName, definition) {
  const columns = database.prepare(`PRAGMA table_info(${tableName})`).all();
  const hasColumn = columns.some((column) => column.name === columnName);

  if (!hasColumn) {
    database.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

ensureColumn("asali_registrations", "ticket_price_naira", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("asali_registrations", "payment_status", "TEXT NOT NULL DEFAULT 'pending'");
ensureColumn("asali_registrations", "tx_ref", "TEXT");
ensureColumn("asali_registrations", "ticket_code", "TEXT");
ensureColumn("asali_registrations", "flutterwave_transaction_id", "TEXT");
ensureColumn("asali_registrations", "ticket_email_sent_at", "TEXT");

function seedProducts() {
  const raw = fs.readFileSync(productsSeedPath, "utf8");
  const products = JSON.parse(raw);
  const upsert = database.prepare(`
    INSERT INTO kanti_products (
      id,
      title,
      short_description,
      category,
      image,
      flutterwave_url,
      is_active,
      updated_at
    ) VALUES (
      @id,
      @title,
      @shortDescription,
      @category,
      @image,
      @flutterwaveUrl,
      1,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      short_description = excluded.short_description,
      category = excluded.category,
      image = excluded.image,
      flutterwave_url = excluded.flutterwave_url,
      is_active = excluded.is_active,
      updated_at = CURRENT_TIMESTAMP
  `);

  for (const product of products) {
    upsert.run(product);
  }
}

seedProducts();

const selectProductsStatement = database.prepare(`
  SELECT
    id,
    title,
    short_description AS shortDescription,
    category,
    image,
    flutterwave_url AS flutterwaveUrl
  FROM kanti_products
  WHERE is_active = 1
    AND (@category IS NULL OR category = @category)
  ORDER BY title COLLATE NOCASE
`);

const insertRegistrationStatement = database.prepare(`
  INSERT INTO asali_registrations (
    full_name,
    phone,
    email,
    gender,
    discovery,
    attendance_type,
    ticket_price_naira,
    notes,
    payment_status
  ) VALUES (
    @fullName,
    @phone,
    @email,
    @gender,
    @discovery,
    @attendanceType,
    @ticketPriceNaira,
    @notes,
    'pending'
  )
`);

const updateRegistrationTxRefStatement = database.prepare(`
  UPDATE asali_registrations SET tx_ref = @txRef WHERE id = @id
`);

const deleteRegistrationStatement = database.prepare(`
  DELETE FROM asali_registrations WHERE id = @id
`);

const selectRegistrationByIdStatement = database.prepare(`
  SELECT
    id,
    full_name AS fullName,
    phone,
    email,
    gender,
    discovery,
    attendance_type AS attendanceType,
    ticket_price_naira AS ticketPriceNaira,
    notes,
    payment_status AS paymentStatus,
    tx_ref AS txRef,
    ticket_code AS ticketCode,
    flutterwave_transaction_id AS flutterwaveTransactionId,
    ticket_email_sent_at AS ticketEmailSentAt
  FROM asali_registrations
  WHERE id = @id
`);

const selectRegistrationByTxRefStatement = database.prepare(`
  SELECT
    id,
    full_name AS fullName,
    phone,
    email,
    gender,
    discovery,
    attendance_type AS attendanceType,
    ticket_price_naira AS ticketPriceNaira,
    notes,
    payment_status AS paymentStatus,
    tx_ref AS txRef,
    ticket_code AS ticketCode,
    flutterwave_transaction_id AS flutterwaveTransactionId,
    ticket_email_sent_at AS ticketEmailSentAt
  FROM asali_registrations
  WHERE tx_ref = @txRef
`);

const markRegistrationPaidStatement = database.prepare(`
  UPDATE asali_registrations SET
    payment_status = 'paid',
    flutterwave_transaction_id = @flutterwaveTransactionId,
    ticket_code = @ticketCode
  WHERE id = @id
`);

const markTicketEmailSentStatement = database.prepare(`
  UPDATE asali_registrations SET ticket_email_sent_at = CURRENT_TIMESTAMP WHERE id = @id
`);

const setTicketCodeStatement = database.prepare(`
  UPDATE asali_registrations SET ticket_code = @ticketCode WHERE id = @id
`);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function getRequestBody(request, maxBytes = 65536) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    request.on("data", (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(new Error("Payload too large"));
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    request.on("error", reject);
  });
}

function normalizeOptionalText(value) {
  const trimmed = String(value || "").trim();
  return trimmed ? trimmed : null;
}

const asaliTicketTypes = {
  Performer: {
    ticketPriceNaira: 5000,
  },
  Audience: {
    ticketPriceNaira: 4000,
  },
};

function getAsaliPaymentLinks() {
  const raw = fs.readFileSync(asaliPaymentLinksPath, "utf8");
  return JSON.parse(raw);
}

function validateRegistration(payload) {
  const fullName = String(payload.fullName || "").trim();
  const phone = String(payload.phone || "").trim();
  const email = String(payload.email || "").trim();
  const gender = String(payload.gender || "").trim();
  const discovery = String(payload.discovery || "").trim();
  const attendanceType = String(payload.attendanceType || "").trim();
  const notes = normalizeOptionalText(payload.notes);

  if (!fullName || !phone || !email || !gender || !discovery || !attendanceType) {
    return { error: "Please complete all required fields." };
  }

  if (!email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  if (!Object.hasOwn(asaliTicketTypes, attendanceType)) {
    return { error: "Please select a valid ticket type." };
  }

  return {
    data: {
      fullName,
      phone,
      email,
      gender,
      discovery,
      attendanceType,
      ticketPriceNaira: asaliTicketTypes[attendanceType].ticketPriceNaira,
      notes,
    },
  };
}

function normalizePhoneForFlutterwave(phone) {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("234")) {
    return digits;
  }
  if (digits.startsWith("0")) {
    return `234${digits.slice(1)}`;
  }
  return digits;
}

function metaToObject(meta) {
  if (!meta) {
    return {};
  }
  if (Array.isArray(meta)) {
    const object = {};
    for (const row of meta) {
      if (row && row.metaname != null) {
        object[row.metaname] = row.metavalue;
      }
    }
    return object;
  }
  if (typeof meta === "object") {
    return meta;
  }
  return {};
}

function generateTicketCode(registrationId) {
  const suffix = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `ASALI9-${registrationId}-${suffix}`;
}

async function flutterwaveInitPayment({
  txRef,
  amountNaira,
  customer,
  redirectUrl,
  registrationId,
  attendanceType,
}) {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secret) {
    return null;
  }

  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount: String(amountNaira),
      currency: "NGN",
      redirect_url: redirectUrl,
      payment_options: "card,account,ussd,banktransfer,mobilemoney",
      customer: {
        email: customer.email,
        phonenumber: normalizePhoneForFlutterwave(customer.phone),
        name: customer.name,
      },
      customizations: {
        title: eventNameDefault,
        description: "Ticket payment — Cavemen Africa",
        logo: `${publicBaseUrl}/assets/cavemen-logo.png`,
      },
      meta: [
        { metaname: "registration_id", metavalue: String(registrationId) },
        { metaname: "attendance_type", metavalue: attendanceType },
      ],
    }),
  });

  const json = await response.json();
  if (!response.ok || json.status !== "success" || !json.data?.link) {
    const message = json.message || "Flutterwave payment could not be started.";
    throw new Error(message);
  }

  return json.data.link;
}

async function flutterwaveVerifyTransaction(transactionId) {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secret) {
    return false;
  }

  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(String(transactionId))}/verify`,
    {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    },
  );

  const json = await response.json();
  return (
    response.ok &&
    json.status === "success" &&
    json.data?.status === "successful"
  );
}

async function sendTicketEmailIfPossible(registration) {
  const transport = createMailTransport();
  if (!transport) {
    console.warn(
      "[asali] SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS). Ticket email skipped.",
    );
    return false;
  }

  const html = buildTicketEmailHtml({
    recipientName: registration.fullName,
    ticketCode: registration.ticketCode,
    attendanceType: registration.attendanceType,
    amountNaira: registration.ticketPriceNaira,
    eventName: eventNameDefault,
  });

  const text = buildTicketEmailText({
    recipientName: registration.fullName,
    ticketCode: registration.ticketCode,
    attendanceType: registration.attendanceType,
    amountNaira: registration.ticketPriceNaira,
    eventName: eventNameDefault,
  });

  await sendTicketEmail(transport, {
    to: registration.email,
    subject: `Your ticket — ${eventNameDefault}`,
    html,
    text,
  });

  return true;
}

async function handleFlutterwaveWebhook(request, response) {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  if (!secretHash) {
    sendJson(response, 503, { error: "Webhook not configured (FLUTTERWAVE_SECRET_HASH)." });
    return true;
  }

  const verifHash = request.headers["verif-hash"];
  if (verifHash !== secretHash) {
    sendJson(response, 401, { error: "Invalid webhook signature." });
    return true;
  }

  let rawBody;
  try {
    rawBody = await getRequestBody(request, 2 * 1024 * 1024);
  } catch (error) {
    if (error.message === "Payload too large") {
      sendJson(response, 413, { error: "Payload too large." });
      return true;
    }
    throw error;
  }

  let body;
  try {
    body = JSON.parse(rawBody || "{}");
  } catch {
    sendJson(response, 400, { error: "Invalid JSON." });
    return true;
  }

  const event = body.event;
  if (event !== "charge.completed") {
    sendJson(response, 200, { received: true, ignored: true });
    return true;
  }

  const data = body.data;
  if (!data || data.status !== "successful") {
    sendJson(response, 200, { received: true, ignored: true });
    return true;
  }

  const transactionId = data.id;
  const txRef = data.tx_ref;

  if (!transactionId || !txRef) {
    sendJson(response, 200, { received: true, ignored: true });
    return true;
  }

  const verified = await flutterwaveVerifyTransaction(transactionId);
  if (!verified) {
    console.error("[asali] Flutterwave transaction verification failed for id", transactionId);
    sendJson(response, 400, { error: "Verification failed." });
    return true;
  }

  const meta = metaToObject(data.meta);
  const registrationIdFromMeta =
    meta.registration_id != null
      ? Number.parseInt(String(meta.registration_id), 10)
      : null;
  const metaIdValid =
    registrationIdFromMeta != null &&
    Number.isInteger(registrationIdFromMeta) &&
    registrationIdFromMeta > 0;

  let registration = selectRegistrationByTxRefStatement.get({ txRef });
  if (!registration && metaIdValid) {
    const byId = selectRegistrationByIdStatement.get({ id: registrationIdFromMeta });
    if (byId && byId.txRef === txRef) {
      registration = byId;
    }
  }

  if (!registration) {
    console.error("[asali] Registration not found for webhook", { txRef, meta });
    sendJson(response, 200, { received: true, ignored: true });
    return true;
  }

  if (registration.paymentStatus === "paid" && registration.ticketEmailSentAt) {
    sendJson(response, 200, { received: true, duplicate: true });
    return true;
  }

  let ticketCode = registration.ticketCode || generateTicketCode(registration.id);

  if (registration.paymentStatus !== "paid") {
    markRegistrationPaidStatement.run({
      id: registration.id,
      flutterwaveTransactionId: String(transactionId),
      ticketCode,
    });
  } else if (!registration.ticketCode) {
    setTicketCodeStatement.run({ id: registration.id, ticketCode });
  }

  registration = selectRegistrationByIdStatement.get({ id: registration.id });
  registration.ticketCode = ticketCode;

  if (!registration.ticketEmailSentAt) {
    try {
      const sent = await sendTicketEmailIfPossible(registration);
      if (sent) {
        markTicketEmailSentStatement.run({ id: registration.id });
      }
    } catch (error) {
      console.error("[asali] Ticket email failed:", error);
    }
  }

  sendJson(response, 200, { received: true });
  return true;
}

async function handleApi(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      database: "sqlite",
      service: "cavemen-africa",
      flutterwaveApi: Boolean(process.env.FLUTTERWAVE_SECRET_KEY),
      smtp: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    });
    return true;
  }

  if (request.method === "GET" && url.pathname === "/api/products") {
    const category = normalizeOptionalText(url.searchParams.get("category"));
    const products = selectProductsStatement.all({
      category: category && category !== "all" ? category : null,
    });
    sendJson(response, 200, { products });
    return true;
  }

  if (request.method === "POST" && url.pathname === "/api/webhooks/flutterwave") {
    return handleFlutterwaveWebhook(request, response);
  }

  if (request.method === "POST" && url.pathname === "/api/asali-registrations") {
    let payload;

    try {
      const rawBody = await getRequestBody(request, 65536);
      payload = JSON.parse(rawBody || "{}");
    } catch (error) {
      if (error.message === "Payload too large") {
        sendJson(response, 413, { error: "Request body too large." });
        return true;
      }
      sendJson(response, 400, { error: "Invalid JSON request body." });
      return true;
    }

    const validation = validateRegistration(payload);
    if (validation.error) {
      sendJson(response, 400, { error: validation.error });
      return true;
    }

    const data = validation.data;
    const insertResult = insertRegistrationStatement.run(data);
    const registrationId = Number(insertResult.lastInsertRowid);
    const txRef = `ASALI-${registrationId}-${Date.now()}`;

    updateRegistrationTxRefStatement.run({ id: registrationId, txRef });

    const thankYouUrl = `${publicBaseUrl}/asali-open-mic/register/thank-you/`;
    let paymentUrl = null;

    if (process.env.FLUTTERWAVE_SECRET_KEY) {
      try {
        paymentUrl = await flutterwaveInitPayment({
          txRef,
          amountNaira: data.ticketPriceNaira,
          customer: {
            email: data.email,
            phone: data.phone,
            name: data.fullName,
          },
          redirectUrl: thankYouUrl,
          registrationId,
          attendanceType: data.attendanceType,
        });
      } catch (error) {
        console.error("[asali] Flutterwave init failed:", error);
        deleteRegistrationStatement.run({ id: registrationId });
        sendJson(response, 502, {
          error:
            "Payment could not be started. Please try again in a moment or contact admin@cavemen.africa.",
        });
        return true;
      }
    } else {
      const paymentLinks = getAsaliPaymentLinks();
      paymentUrl = normalizeOptionalText(paymentLinks[data.attendanceType]);
      if (!paymentUrl) {
        deleteRegistrationStatement.run({ id: registrationId });
        sendJson(response, 503, {
          error: `Payment link not configured yet for ${data.attendanceType.toLowerCase()} tickets.`,
        });
        return true;
      }
    }

    sendJson(response, 201, {
      ok: true,
      registrationId,
      message: "Registration received successfully.",
      paymentUrl,
      ticketPriceNaira: data.ticketPriceNaira,
      paymentFlow: process.env.FLUTTERWAVE_SECRET_KEY ? "flutterwave_api" : "payment_link",
    });
    return true;
  }

  if (url.pathname.startsWith("/api/")) {
    sendJson(response, 404, { error: "API route not found." });
    return true;
  }

  return false;
}

function resolvePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const requestedPath = cleanPath === "/" ? "/index.html" : cleanPath;
  const absoluteRequestedPath = path.normalize(path.join(root, requestedPath));

  if (!absoluteRequestedPath.startsWith(root)) {
    return null;
  }

  if (fs.existsSync(absoluteRequestedPath) && fs.statSync(absoluteRequestedPath).isFile()) {
    return absoluteRequestedPath;
  }

  const directoryIndex = path.join(absoluteRequestedPath, "index.html");
  if (fs.existsSync(directoryIndex) && fs.statSync(directoryIndex).isFile()) {
    return directoryIndex;
  }

  const htmlPath = `${absoluteRequestedPath}.html`;
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
    return htmlPath;
  }

  return path.join(root, "index.html");
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  try {
    const handled = await handleApi(request, response, url);
    if (handled) {
      return;
    }
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Internal Server Error" });
    return;
  }

  const filePath = resolvePath(request.url || "/");

  if (!filePath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Internal Server Error");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[extension] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    response.end(file);
  });
});

server.listen(port, () => {
  console.log(`Cavemen site and API running at http://localhost:${port}`);
  if (!process.env.FLUTTERWAVE_SECRET_KEY) {
    console.warn(
      "[asali] FLUTTERWAVE_SECRET_KEY not set — using asali-payment-links.json (webhook ticket emails need API-initiated payments).",
    );
  }
  if (!process.env.FLUTTERWAVE_SECRET_HASH) {
    console.warn("[asali] FLUTTERWAVE_SECRET_HASH not set — POST /api/webhooks/flutterwave will return 503.");
  }
});
