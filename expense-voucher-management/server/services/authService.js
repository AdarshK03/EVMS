const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT id, full_name, email, password, role FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await pool.query(
    'SELECT id, full_name, email, role FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = { findUserByEmail, findUserById, verifyPassword };
