-- Логин
CREATE OR REPLACE FUNCTION users.login(
  IN  i_username text,
  IN  i_password text,
  OUT o_token text
) AS $$
DECLARE
  _user jsonb;
BEGIN
  -- Проверка на существование пользователя
  SELECT * FROM users WHERE body->>'username' = i_username && body->>'password' = i_password && body->>'state' = 'ACTIVE' into _user;

  IF NOT FOUND THEN
    RISE 'LOGIN_FAILED';
  END IF;

  -- Генерация токена
  o_token = md5(random()::text);

  INSERT INTO users.online(token, user, created_at)
    VALUES (o_token, _user, now());
END;
$$ LANGUAGE 'plpgsql';

-- Test
select * from users.login('777','10');
