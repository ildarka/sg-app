-- Удаление пользователя
CREATE OR REPLACE FUNCTION users.delete_user(
  IN i_id    int
) RETURNS void AS $$
DECLARE
  _user_id int;
BEGIN

  DELETE FROM users WHERE id = i_id;

END;
$$
LANGUAGE 'plpgsql' VOLATILE SECURITY DEFINER;
