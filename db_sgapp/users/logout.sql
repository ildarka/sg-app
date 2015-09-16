-- Логаут
CREATE OR REPLACE FUNCTION users.logout(
  IN  i_token text
) RETURNS VOID AS $$
BEGIN
  DELETE FROM users.online WHERE token = i_token;
END;
$$ LANGUAGE 'plpgsql';
