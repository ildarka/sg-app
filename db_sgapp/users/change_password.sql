-- Смена пароля
CREATE OR REPLACE FUNCTION users.change_password(
  IN  i_token         text,
  IN  i_current_pass  text,
  IN  i_new_pass      text
) RETURNS void AS $$
DECLARE
  _user_id int;
  _user    jsonb;
BEGIN
  _user = users._getuser(i_token);
  _user_id = users._getuserid(i_token);

  IF _user->>'password' != i_current_pass THEN
    RISE 'INCORRECT PASSWORD';
  END IF;

  UPDATE users
    SET body->>'password' = i_new_pass
    WHERE id = _user_id;
END;
$$
LANGUAGE 'plpgsql' VOLATILE SECURITY DEFINER;
