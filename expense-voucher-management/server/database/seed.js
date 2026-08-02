const bcrypt = require('bcrypt');
const pool = require('../config/db');

const SALT_ROUNDS = 10;

async function seedUsers() {
  const users = [
    { full_name: 'John Employee', email: 'employee@test.com', password: 'password123', role: 'Employee' },
    { full_name: 'Jane Director', email: 'director@test.com', password: 'password123', role: 'Director' },
    { full_name: 'Alan Accounts', email: 'accounts@test.com', password: 'password123', role: 'Accounts' },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    await pool.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
       SET password = EXCLUDED.password, full_name = EXCLUDED.full_name, role = EXCLUDED.role`,
      [user.full_name, user.email, hashedPassword, user.role]
    );
  }

  console.log('Seed complete: 1 Employee, 1 Director, 1 Accounts');
}

seedUsers().then(() => process.exit(0)).catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
