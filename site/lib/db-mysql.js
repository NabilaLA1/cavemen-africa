/**
 * MySQL (mysql2) data layer for Cavemen site API.
 * Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE (optional MYSQL_PORT, MYSQL_SSL).
 */

const fs = require("node:fs");
const path = require("node:path");
const mysql = require("mysql2/promise");

const productsSeedPath = path.join(__dirname, "..", "data", "kanti-products.json");

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS kanti_products (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    short_description TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    image VARCHAR(1024) NOT NULL,
    flutterwave_url VARCHAR(1024) NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  `CREATE TABLE IF NOT EXISTS asali_registrations (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    gender VARCHAR(64) NOT NULL,
    discovery VARCHAR(512) NOT NULL,
    attendance_type VARCHAR(32) NOT NULL,
    ticket_price_naira INT UNSIGNED NOT NULL DEFAULT 0,
    notes TEXT NULL,
    payment_status VARCHAR(24) NOT NULL DEFAULT 'pending',
    tx_ref VARCHAR(128) NULL,
    ticket_code VARCHAR(64) NULL,
    flutterwave_transaction_id VARCHAR(128) NULL,
    ticket_email_sent_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_asali_tx_ref (tx_ref),
    KEY idx_asali_email (email(191))
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
];

/** @type {import('mysql2/promise').Pool | null} */
let pool = null;

function getMysqlConfig() {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;
  if (!host || !user || !database) {
    return null;
  }
  return {
    host,
    user,
    password: password ?? "",
    database,
    port: Number(process.env.MYSQL_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    ssl: process.env.MYSQL_SSL === "true" ? {} : undefined,
  };
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
    ticketEmailSentAt: row.ticketEmailSentAt
      ? row.ticketEmailSentAt instanceof Date
        ? row.ticketEmailSentAt.toISOString()
        : String(row.ticketEmailSentAt)
      : null,
  };
}

const ASALI_SELECT = `
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

async function getPool() {
  if (pool) {
    return pool;
  }
  const config = getMysqlConfig();
  if (!config) {
    throw new Error("MySQL is not configured. Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE.");
  }
  pool = mysql.createPool(config);
  return pool;
}

/** Same name as db-sqlite `init` for a unified entry point. */
async function init() {
  return initMySql();
}

async function initMySql() {
  const p = await getPool();
  for (const statement of SCHEMA_STATEMENTS) {
    await p.query(statement);
  }
  const raw = fs.readFileSync(productsSeedPath, "utf8");
  const products = JSON.parse(raw);
  if (!Array.isArray(products)) {
    return;
  }
  const sql = `
    INSERT INTO kanti_products (
      id, title, short_description, category, image, flutterwave_url, is_active, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      short_description = VALUES(short_description),
      category = VALUES(category),
      image = VALUES(image),
      flutterwave_url = VALUES(flutterwave_url),
      is_active = VALUES(is_active),
      updated_at = CURRENT_TIMESTAMP
  `;
  for (const product of products) {
    await p.execute(sql, [
      product.id,
      product.title,
      product.shortDescription,
      product.category,
      product.image,
      product.flutterwaveUrl,
    ]);
  }
}

/**
 * @param {string | null} category
 */
async function selectProducts(category) {
  const p = await getPool();
  if (category && category !== "all") {
    const [rows] = await p.query(
      `SELECT
        id,
        title,
        short_description AS shortDescription,
        category,
        image,
        flutterwave_url AS flutterwaveUrl
      FROM kanti_products
      WHERE is_active = 1 AND category = ?
      ORDER BY title ASC`,
      [category],
    );
    return rows;
  }
  const [rows] = await p.query(
    `SELECT
      id,
      title,
      short_description AS shortDescription,
      category,
      image,
      flutterwave_url AS flutterwaveUrl
    FROM kanti_products
    WHERE is_active = 1
    ORDER BY title ASC`,
  );
  return rows;
}

/**
 * @param {object} data
 */
async function insertAsaliRegistration(data) {
  const p = await getPool();
  const [result] = await p.execute(
    `INSERT INTO asali_registrations (
      full_name, phone, email, gender, discovery, attendance_type,
      ticket_price_naira, notes, payment_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      data.fullName,
      data.phone,
      data.email,
      data.gender,
      data.discovery,
      data.attendanceType,
      data.ticketPriceNaira,
      data.notes,
    ],
  );
  return Number(result.insertId);
}

async function updateAsaliTxRef(id, txRef) {
  const p = await getPool();
  await p.execute("UPDATE asali_registrations SET tx_ref = ? WHERE id = ?", [txRef, id]);
}

async function deleteAsaliById(id) {
  const p = await getPool();
  await p.execute("DELETE FROM asali_registrations WHERE id = ?", [id]);
}

async function selectAsaliById(id) {
  const p = await getPool();
  const [rows] = await p.query(`${ASALI_SELECT} WHERE id = ?`, [id]);
  return mapAsaliRow(rows[0]);
}

async function selectAsaliByTxRef(txRef) {
  const p = await getPool();
  const [rows] = await p.query(`${ASALI_SELECT} WHERE tx_ref = ?`, [txRef]);
  return mapAsaliRow(rows[0]);
}

async function markAsaliPaid(id, flutterwaveTransactionId, ticketCode) {
  const p = await getPool();
  await p.execute(
    `UPDATE asali_registrations SET
      payment_status = 'paid',
      flutterwave_transaction_id = ?,
      ticket_code = ?
    WHERE id = ?`,
    [flutterwaveTransactionId, ticketCode, id],
  );
}

async function setAsaliTicketCode(id, ticketCode) {
  const p = await getPool();
  await p.execute("UPDATE asali_registrations SET ticket_code = ? WHERE id = ?", [ticketCode, id]);
}

async function markTicketEmailSent(id) {
  const p = await getPool();
  await p.execute(
    "UPDATE asali_registrations SET ticket_email_sent_at = CURRENT_TIMESTAMP WHERE id = ?",
    [id],
  );
}

function isMySqlConfigured() {
  return getMysqlConfig() !== null;
}

module.exports = {
  init,
  initMySql,
  getPool,
  isMySqlConfigured,
  selectProducts,
  insertAsaliRegistration,
  updateAsaliTxRef,
  deleteAsaliById,
  selectAsaliById,
  selectAsaliByTxRef,
  markAsaliPaid,
  setAsaliTicketCode,
  markTicketEmailSent,
};
