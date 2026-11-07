-- Up Migration
INSERT INTO users (email, password_hash)
VALUES ('dev@local', 'not-a-real-hash')
ON CONFLICT (email) DO NOTHING;

-- Down Migration
DELETE FROM users WHERE email = 'dev@local';