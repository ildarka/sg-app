-- Логин
CREATE OR REPLACE FUNCTION users.login(
  IN  i_name text,
  IN  i_password text,
  OUT o_id int,
  OUT o_body jsonb
) AS $$
BEGIN
  -- Логин только пользователей со стате ACTIVE
  SELECT id, body FROM users 
  WHERE body->>'name' = i_name AND password = i_password AND body->>'state' = 'ACTIVE'
  INTO o_id, o_body;

  IF NOT FOUND THEN RAISE 'Login failed'; END IF;

END;
$$ LANGUAGE 'plpgsql';

-- Test
select * from users.login('1','1');
