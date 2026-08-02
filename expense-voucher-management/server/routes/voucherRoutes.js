const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const {
  createVoucher,
  getVouchers,
  getVoucher,
  updateVoucher,
  deleteVoucher,
  submitVoucher,
} = require('../controllers/voucherController');

router.use(authenticate, authorize('Employee'));

router.post('/', createVoucher);
router.get('/', getVouchers);
router.get('/:id', getVoucher);
router.put('/:id', updateVoucher);
router.delete('/:id', deleteVoucher);
router.patch('/:id/submit', submitVoucher);

module.exports = router;
