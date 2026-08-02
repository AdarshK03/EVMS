INSERT INTO users (full_name, email, password, role) VALUES
('John Employee', 'employee@test.com', '$2b$10$zo1itN6eJDwexz/7JbmR2.AKPGPyjJbkScmKIgxYQGQBK3sThdsja', 'Employee'),
('Jane Director', 'director@test.com', '$2b$10$lVDy1Dy7PuFOZsK12INGZuetn3hSed8Wx80TNAvi56XxMn4XEnEQ2', 'Director'),
('Alan Accounts', 'accounts@test.com', '$2b$10$n7mzzxuvlDTKiji8Qr1JJuZFIjYV4/P95Y7D0D7B.UKY0Vqw5pCKS', 'Accounts')
ON CONFLICT (email) DO UPDATE
SET password = EXCLUDED.password, full_name = EXCLUDED.full_name, role = EXCLUDED.role;
