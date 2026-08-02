/*
# Create users and vouchers tables

1. New Tables
- `users`
  - `id` (SERIAL, primary key)
  - `full_name` (VARCHAR 150, not null)
  - `email` (VARCHAR 255, unique, not null)
  - `password` (VARCHAR 255, not null) - placeholder for now, bcrypt hashing not yet implemented
  - `role` (VARCHAR 20, not null) - CHECK constraint allows only 'Employee', 'Director', 'Accounts'
  - `created_at` (TIMESTAMPTZ, default now)
  - `updated_at` (TIMESTAMPTZ, default now)

- `vouchers`
  - `id` (SERIAL, primary key)
  - `voucher_number` (VARCHAR 50, unique, not null)
  - `voucher_date` (DATE, not null)
  - `expense_date` (DATE, not null)
  - `department` (VARCHAR 150, not null)
  - `expense_title` (VARCHAR 255, not null)
  - `expense_category` (VARCHAR 100, not null)
  - `expense_description` (TEXT, nullable)
  - `amount` (NUMERIC 12,2, not null)
  - `employee_id` (INTEGER, not null, references users(id))
  - `employee_signature` (VARCHAR 255, nullable)
  - `status` (VARCHAR 20, not null, default 'Draft') - CHECK allows 'Draft', 'Submitted', 'Approved', 'Rejected'
  - `director_signature` (VARCHAR 255, nullable)
  - `approval_date` (DATE, nullable)
  - `rejection_reason` (TEXT, nullable)
  - `created_at` (TIMESTAMPTZ, default now)
  - `updated_at` (TIMESTAMPTZ, default now)

2. Security
- RLS NOT enabled: this table is accessed server-side via the Express backend using the pg Pool connection with privileged database credentials. All queries are made from the backend.

3. Important Notes
- The `users` table currently stores placeholder passwords. Bcrypt hashing will be added when authentication is implemented.
- The `vouchers.employee_id` column references `users(id)` with a foreign key constraint.
- `voucher_number` is unique.
*/

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
