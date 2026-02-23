CREATE TABLE app_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read app config"
  ON app_config FOR SELECT USING (true);

INSERT INTO app_config (key, value) VALUES
  ('login_enabled', 'true'),
  ('signup_enabled', 'true'),
  ('login_banner', 'null');
