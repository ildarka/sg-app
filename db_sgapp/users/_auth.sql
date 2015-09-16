-- Проверка авторизации
CREATE OR REPLACE FUNCTION users._auth(
  IN  i_token text,
  OUT o_user jsonb
  
) AS $$
DECLARE
  _expired timestamp;
BEGIN
  
  -- Удаление просроченных сессий
  _expired = now() - 3000;
  
  DELETE FROM users.online
    WHERE created_at < _expired;

  SELECT user INTO o_user
    FROM users.online
    WHERE token = i_token;

  IF NOT FOUND THEN
    RISE 'UNAUTHORIZED';
  END IF;

  UPDATE users.online
    SET created_at = now()
    WHERE token = i_token;
END;
$$
LANGUAGE 'plpgsql' VOLATILE SECURITY DEFINER;