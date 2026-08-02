const ApiResponse = require('../utils/ApiResponse');

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json(ApiResponse.fail('Forbidden: insufficient permissions'));
    }
    return next();
  };
}

module.exports = authorize;
