-- Регистрация нового пользователя
CREATE OR REPLACE FUNCTION users.register(
  IN i_name text,
  IN i_password text
) RETURNS VOID AS $$

DECLARE
  _u text;
  
begin
  -- Проверка на существование пользователя
  PERFORM 1 FROM users WHERE body->>'name' = i_name;

  IF FOUND THEN RAISE 'DUPLICATE_USER'; END IF;

  -- Добавление пользователя
  INSERT INTO users(body, password) VALUES (
    json_build_object('name', i_name, 'state', 'NEW')::jsonb,
    i_password
  );

  -- o_id = currval(pg_get_serial_sequence('users', 'id'));
  end;
$$ LANGUAGE 'plpgsql';

-- Test
-- select * from users.register('777','10');
