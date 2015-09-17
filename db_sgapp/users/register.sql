-- Регистрация нового пользователя
CREATE OR REPLACE FUNCTION users.register(
  IN i_username text,
  IN i_password text
) RETURNS VOID AS $$

DECLARE
  _u text;
  
begin
  -- Проверка на существование пользователя
  PERFORM 1 FROM users WHERE body->>'username' = i_username;

  IF FOUND THEN RAISE 'Duplicate user'; END IF;

  -- Добавление пользователя
  INSERT INTO users(body) VALUES (
    json_build_object('username', i_username, 'password', i_password, 'state', 'NEW')::jsonb
  );

  -- o_id = currval(pg_get_serial_sequence('users', 'id'));
  end;
$$ LANGUAGE 'plpgsql';

-- Test
-- select * from users.register('777','10');
