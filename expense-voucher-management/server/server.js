require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const voucherRoutes = require('./routes/voucherRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      success: true,
      database: 'connected',
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: 'disconnected',
      message: 'Database connection failed',
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/vouchers', voucherRoutes);

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
