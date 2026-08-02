/*
# Create users table for authentication

1. New Tables
- `users`
  - `id` (SERIAL, primary key)
  - `full_name` (VARCHAR 150, not null) - user's display name
  - `email` (VARCHAR 255, unique, not null) - login email
  - `password` (VARCHAR 255, not null) - bcrypt password hash
  - `role` (VARCHAR 20, not null) - CHECK constraint allows only 'Employee', 'Director', 'Accounts'
  - `created_at` (TIMESTAMPTZ, default now)
  - `updated_at` (TIMESTAMPTZ, default now)

2. Security
- RLS NOT enabled: this table is accessed server-side via the Express backend using the pg Pool connection with the service-role database credentials. Authentication is handled by the custom Express/JWT layer, not Supabase Auth. All queries are made from the backend with privileged DB credentials.

3. Important Notes
- This table stores bcrypt password hashes only — never plain passwords.
- The `role` column is constrained to exactly three values: Employee, Director, Accounts.
- This is a custom auth implementation (Express + JWT + bcrypt), not Supabase Auth.
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
