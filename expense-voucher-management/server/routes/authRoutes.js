const express = require('express');
const router = express.Router();
const { login, logout, me } = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, me);

module.exports = router;
