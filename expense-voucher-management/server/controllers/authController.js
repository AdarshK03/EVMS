const { findUserByEmail, findUserById, verifyPassword } = require('../services/authService');
const { generateToken } = require('../utils/generateToken');
const ApiResponse = require('../utils/ApiResponse');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(ApiResponse.fail('Email and password are required'));
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json(ApiResponse.fail('A valid email is required'));
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json(ApiResponse.fail('Invalid email or password'));
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json(ApiResponse.fail('Invalid email or password'));
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.status(200).json(
      ApiResponse.ok('Login successful', {
        user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
      })
    );
  } catch (error) {
    return res.status(500).json(ApiResponse.fail('Login failed'));
  }
}

async function logout(req, res) {
  try {
    res.clearCookie('token', COOKIE_OPTIONS);
    return res.status(200).json(ApiResponse.ok('Logout successful'));
  } catch (error) {
    return res.status(500).json(ApiResponse.fail('Logout failed'));
  }
}

async function me(req, res) {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json(ApiResponse.fail('User not found'));
    }
    return res.status(200).json(
      ApiResponse.ok('Authenticated user', {
        user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
      })
    );
  } catch (error) {
    return res.status(500).json(ApiResponse.fail('Failed to fetch user'));
  }
}

module.exports = { login, logout, me };
