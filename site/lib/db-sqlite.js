/**
 * SQLite fallback (node:sqlite) when MYSQL_* is not set.
 * Same public API as db-mysql.js.
 */

const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const root = path.join(__dirname, "..");
const databasePath = path.join(root, "data", "cavemen.db");
const productsSeedPath = path.join(root, "data", "kanti-products.json");

/** @type {import('node:sqlite').DatabaseSync | null} */
let database = null;

function getDb() {
  if (database) {
    return database;
  }
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new DatabaseSync(databasePath);
  database = db;
  return db;
}

function ensureColumn(tableName, columnName, definition) {
  const db = getDb();
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  const hasColumn = columns.some((column) => column.name === columnName);
  if (!hasColumn) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

function mapAsaliRow(row) {
  if (!row) {
    return null;
  }
  return {
    id: Number(row.id),
    fullName: row.fullName,
    phone: row.phone,
    email: row.email,
    gender: row.gender,
    discovery: row.discovery,
    attendanceType: row.attendanceType,
    ticketPriceNaira: Number(row.ticketPriceNaira),
    notes: row.notes,
    paymentStatus: row.paymentStatus,
    txRef: row.txRef,
    ticketCode: row.ticketCode,
    flutterwaveTransactionId: row.flutterwaveTransactionId,
    ticketEmailSentAt: row.ticketEmailSentAt,
  };
}

async function init() {
  const db = getDb();
  db.exec(`
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
  ensureColumn("asali_registrations", "ticket_price_naira", "INTEGER NOT NULL DEFAULT 0");
  ensureColumn("asali_registrations", "payment_status", "TEXT NOT NULL DEFAULT 'pending'");
  ensureColumn("asali_registrations", "tx_ref", "TEXT");
  ensureColumn("asali_registrations", "ticket_code", "TEXT");
  ensureColumn("asali_registrations", "flutterwave_transaction_id", "TEXT");
  ensureColumn("asali_registrations", "ticket_email_sent_at", "TEXT");

  const raw = fs.readFileSync(productsSeedPath, "utf8");
  const products = JSON.parse(raw);
  const upsert = db.prepare(`
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

const selectRegistrationByIdSQL = `
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
`;

/**
 * @param {string | null} category
 */
async function selectProducts(category) {
  const db = getDb();
  if (category && category !== "all") {
    return db
      .prepare(
        `SELECT
        id,
        title,
        short_description AS shortDescription,
        category,
        image,
        flutterwave_url AS flutterwaveUrl
      FROM kanti_products
      WHERE is_active = 1 AND category = @category
      ORDER BY title COLLATE NOCASE`,
      )
      .all({ category });
  }
  return db
    .prepare(
      `SELECT
        id,
        title,
        short_description AS shortDescription,
        category,
        image,
        flutterwave_url AS flutterwaveUrl
      FROM kanti_products
      WHERE is_active = 1
      ORDER BY title COLLATE NOCASE`,
    )
    .all();
}

/**
 * @param {object} data
 */
async function insertAsaliRegistration(data) {
  const db = getDb();
  const insert = db.prepare(`
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
  const r = insert.run(data);
  return Number(r.lastInsertRowid);
}

async function updateAsaliTxRef(id, txRef) {
  const db = getDb();
  db.prepare("UPDATE asali_registrations SET tx_ref = @txRef WHERE id = @id").run({ id, txRef });
}

async function deleteAsaliById(id) {
  const db = getDb();
  db.prepare("DELETE FROM asali_registrations WHERE id = @id").run({ id });
}

async function selectAsaliById(id) {
  const db = getDb();
  const row = db
    .prepare(`${selectRegistrationByIdSQL} WHERE id = @id`)
    .get({ id });
  return mapAsaliRow(row);
}

async function selectAsaliByTxRef(txRef) {
  const db = getDb();
  const row = db
    .prepare(`${selectRegistrationByIdSQL} WHERE tx_ref = @txRef`)
    .get({ txRef });
  return mapAsaliRow(row);
}

async function markAsaliPaid(id, flutterwaveTransactionId, ticketCode) {
  const db = getDb();
  db.prepare(
    `UPDATE asali_registrations SET
    payment_status = 'paid',
    flutterwave_transaction_id = @flutterwaveTransactionId,
    ticket_code = @ticketCode
  WHERE id = @id`,
  ).run({ id, flutterwaveTransactionId, ticketCode });
}

async function setAsaliTicketCode(id, ticketCode) {
  const db = getDb();
  db.prepare("UPDATE asali_registrations SET ticket_code = @ticketCode WHERE id = @id").run({
    id,
    ticketCode,
  });
}

async function markTicketEmailSent(id) {
  const db = getDb();
  db.prepare(
    "UPDATE asali_registrations SET ticket_email_sent_at = CURRENT_TIMESTAMP WHERE id = @id",
  ).run({ id });
}

function isMySqlConfigured() {
  return false;
}

module.exports = {
  init,
  isMySqlConfigured,
  selectProducts,
  insertAsaliRegistration,
  updateAsaliTxRef,
  deleteAsaliById,
  selectAsaliById,
  selectAsaliByTxRef,
  markAsaliPaid,
  setAsaliTicketCode: setAsaliTicketCode,
  markTicketEmailSent,
};
