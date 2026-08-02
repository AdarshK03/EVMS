CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('Employee', 'Director', 'Accounts')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vouchers (
  id SERIAL PRIMARY KEY,
  voucher_number VARCHAR(50) UNIQUE NOT NULL,
  voucher_date DATE NOT NULL,
  expense_date DATE NOT NULL,
  department VARCHAR(150) NOT NULL,
  expense_title VARCHAR(255) NOT NULL,
  expense_category VARCHAR(100) NOT NULL,
  expense_description TEXT,
  amount NUMERIC(12, 2) NOT NULL,
  employee_id INTEGER NOT NULL REFERENCES users(id),
  employee_signature VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Rejected')),
  director_signature VARCHAR(255),
  approval_date DATE,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
