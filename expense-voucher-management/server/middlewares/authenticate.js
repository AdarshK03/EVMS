const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/ApiResponse');
const { JWT_SECRET } = require('../utils/generateToken');

function authenticate(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json(ApiResponse.fail('Authentication required'));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(ApiResponse.fail('Token expired'));
    }
    return res.status(401).json(ApiResponse.fail('Invalid token'));
  }
}

module.exports = authenticate;
