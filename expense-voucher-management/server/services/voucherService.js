const pool = require('../config/db');

function generateVoucherNumber(year) {
  const prefix = `EXP-${year}-`;
  return pool
    .query(
      `SELECT voucher_number FROM vouchers WHERE voucher_number LIKE $1 ORDER BY id DESC LIMIT 1`,
      [`${prefix}%`]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return `${prefix}0001`;
      }
      const lastNumber = parseInt(result.rows[0].voucher_number.split('-')[2], 10);
      return `${prefix}${String(lastNumber + 1).padStart(4, '0')}`;
    });
}

async function createVoucher(employeeId, data) {
  const year = new Date().getFullYear();
  const voucherNumber = await generateVoucherNumber(year);

  const result = await pool.query(
    `INSERT INTO vouchers (
      voucher_number, voucher_date, expense_date, department, expense_title,
      expense_category, expense_description, amount, employee_id, employee_signature, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Draft')
    RETURNING *`,
    [
      voucherNumber,
      data.voucher_date || new Date().toISOString().split('T')[0],
      data.expense_date,
      data.department,
      data.expense_title,
      data.expense_category,
      data.expense_description || null,
      data.amount,
      employeeId,
      data.employee_signature || null,
    ]
  );

  return result.rows[0];
}

async function getVouchersByEmployee(employeeId) {
  const result = await pool.query(
    `SELECT * FROM vouchers WHERE employee_id = $1 ORDER BY created_at DESC`,
    [employeeId]
  );
  return result.rows;
}

async function getVoucherById(id, employeeId) {
  const result = await pool.query(
    `SELECT * FROM vouchers WHERE id = $1 AND employee_id = $2`,
    [id, employeeId]
  );
  return result.rows[0] || null;
}

async function updateVoucher(id, employeeId, data) {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  const allowedFields = [
    'expense_date',
    'department',
    'expense_title',
    'expense_category',
    'expense_description',
    'amount',
    'employee_signature',
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = $${paramIndex}`);
      values.push(data[field]);
      paramIndex++;
    }
  }

  if (fields.length === 0) {
    return getVoucherById(id, employeeId);
  }

  values.push(id, employeeId);

  const result = await pool.query(
    `UPDATE vouchers SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${paramIndex} AND employee_id = $${paramIndex + 1} AND status = 'Draft'
     RETURNING *`,
    values
  );

  return result.rows[0] || null;
}

async function deleteVoucher(id, employeeId) {
  const result = await pool.query(
    `DELETE FROM vouchers WHERE id = $1 AND employee_id = $2 AND status = 'Draft' RETURNING id`,
    [id, employeeId]
  );
  return result.rows[0] || null;
}

async function submitVoucher(id, employeeId) {
  const result = await pool.query(
    `UPDATE vouchers SET status = 'Submitted', updated_at = NOW()
     WHERE id = $1 AND employee_id = $2 AND status = 'Draft' AND employee_signature IS NOT NULL
     RETURNING *`,
    [id, employeeId]
  );
  return result.rows[0] || null;
}

module.exports = {
  createVoucher,
  getVouchersByEmployee,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  submitVoucher,
};
