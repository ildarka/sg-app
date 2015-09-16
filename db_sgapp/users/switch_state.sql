CREATE OR REPLACE FUNCTION users.switch_user(
  IN i_id    int,
  IN i_state text
) RETURNS void AS $$
DECLARE

  _new_value      json;
BEGIN

  UPDATE users
    SET body->>'state' = i_state
    WHERE id = i_id;

END;
$$
LANGUAGE 'plpgsql' VOLATILE SECURITY DEFINER;
