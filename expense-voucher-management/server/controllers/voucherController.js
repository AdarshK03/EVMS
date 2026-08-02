const voucherService = require('../services/voucherService');
const ApiResponse = require('../utils/ApiResponse');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateVoucherInput(data) {
  const errors = [];

  if (!data.department || !data.department.trim()) errors.push('Department is required');
  if (!data.expense_title || !data.expense_title.trim()) errors.push('Expense Title is required');
  if (!data.expense_date) errors.push('Expense Date is required');
  if (!data.expense_category || !data.expense_category.trim()) errors.push('Expense Category is required');
  if (data.amount === undefined || data.amount === null || isNaN(data.amount)) {
    errors.push('Amount is required');
  } else if (Number(data.amount) <= 0) {
    errors.push('Amount must be greater than 0');
  }

  return errors;
}

async function createVoucher(req, res) {
  try {
    const errors = validateVoucherInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json(ApiResponse.fail(errors.join('. ')));
    }

    const voucher = await voucherService.createVoucher(req.user.id, req.body);
    return res.status(201).json(ApiResponse.ok('Voucher created', voucher));
  } catch (error) {
    return res.status(500).json(ApiResponse.fail('Failed to create voucher'));
  }
}

async function getVouchers(req, res) {
  try {
    const vouchers = await voucherService.getVouchersByEmployee(req.user.id);
    return res.status(200).json(ApiResponse.ok('Vouchers retrieved', vouchers));
  } catch (error) {
    return res.status(500).json(ApiResponse.fail('Failed to fetch vouchers'));
  }
}

async function getVoucher(req, res) {
  try {
    const voucher = await voucherService.getVoucherById(req.params.id, req.user.id);
    if (!voucher) {
      return res.status(404).json(ApiResponse.fail('Voucher not found'));
    }
    return res.status(200).json(ApiResponse.ok('Voucher retrieved', voucher));
  } catch (error) {
    return res.status(500).json(ApiResponse.fail('Failed to fetch voucher'));
  }
}

async function updateVoucher(req, res) {
  try {
    const existing = await voucherService.getVoucherById(req.params.id, req.user.id);
    if (!existing) {
      return res.status(404).json(ApiResponse.fail('Voucher not found'));
    }
    if (existing.status !== 'Draft') {
      return res.status(400).json(ApiResponse.fail('Only Draft vouchers can be edited'));
    }

    const errors = validateVoucherInput({ ...existing, ...req.body });
    if (errors.length > 0) {
      return res.status(400).json(ApiResponse.fail(errors.join('. ')));
    }

    const voucher = await voucherService.updateVoucher(req.params.id, req.user.id, req.body);
    if (!voucher) {
      return res.status(404).json(ApiResponse.fail('Voucher not found or not editable'));
    }
    return res.status(200).json(ApiResponse.ok('Voucher updated', voucher));
  } catch (error) {
    return res.status(500).json(ApiResponse.fail('Failed to update voucher'));
  }
}

async function deleteVoucher(req, res) {
  try {
    const deleted = await voucherService.deleteVoucher(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json(ApiResponse.fail('Voucher not found or cannot be deleted'));
    }
    return res.status(200).json(ApiResponse.ok('Voucher deleted'));
  } catch (error) {
    return res.status(500).json(ApiResponse.fail('Failed to delete voucher'));
  }
}

async function submitVoucher(req, res) {
  try {
    const existing = await voucherService.getVoucherById(req.params.id, req.user.id);
    if (!existing) {
      return res.status(404).json(ApiResponse.fail('Voucher not found'));
    }
    if (existing.status !== 'Draft') {
      return res.status(400).json(ApiResponse.fail('Only Draft vouchers can be submitted'));
    }
    if (!existing.employee_signature) {
      return res.status(400).json(ApiResponse.fail('Employee signature is required before submitting'));
    }

    const voucher = await voucherService.submitVoucher(req.params.id, req.user.id);
    if (!voucher) {
      return res.status(400).json(ApiResponse.fail('Voucher could not be submitted'));
    }
    return res.status(200).json(ApiResponse.ok('Voucher submitted', voucher));
  } catch (error) {
    return res.status(500).json(ApiResponse.fail('Failed to submit voucher'));
  }
}

module.exports = {
  createVoucher,
  getVouchers,
  getVoucher,
  updateVoucher,
  deleteVoucher,
  submitVoucher,
};
