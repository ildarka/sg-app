CREATE OR REPLACE FUNCTION um.edit_user(
  IN  i_token         text,
  IN  i_id            int,
  IN  i_name          text,
  IN  i_password      text,
  IN  i_admin_pass    text,
  IN  i_group_id      int,
  IN  i_full_name     text,
  IN  i_language      text,
  IN  i_rights        int,
  IN  i_state         text,
  IN  i_start_time    date,
  IN  i_end_time      date
) RETURNS void AS $$
DECLARE
  _user_id      int;
  _rights       int;
  _group_id     int;
  _hash         text;

  _old_value    json;
  _new_value    json;
BEGIN

  _user_id = system._auth(i_token);

  SELECT * INTO _rights, _group_id
    FROM system._check_rights(_user_id, 'USERS', 'WRITE');

  -- forbid rights downgrading for own user
  IF i_id = _user_id AND NOT i_group_id = _group_id THEN
    PERFORM system._raise_error(_user_id, 'DOWNGRADE_OWN_RIGHTS');
  END IF;

  SELECT password
    INTO _hash
    FROM um.users
    WHERE id = _user_id;

  IF _hash != md5(i_admin_pass) THEN
    PERFORM system._raise_error(_user_id, 'OLD_PASSWORD_INCORRECT');
  END IF;

  PERFORM um._check_allowed_user(_user_id, _group_id, i_id);

  -- проверка на незаконное повышение прав
  IF (_rights & i_rights) != i_rights THEN
    PERFORM system._raise_error(_user_id, 'FORBIDDEN');
  END IF;

  PERFORM 1
    FROM um.users
    WHERE id != i_id
    AND name = i_name
    AND state != 'DELETED';

  IF FOUND THEN
    PERFORM system._raise_error(_user_id, 'USER_DUPLICATE');
  END IF;

  IF coalesce(i_password, '') != '' THEN
    PERFORM um.change_password(i_token, i_admin_pass ,i_id , i_password);
  END IF;

  SELECT row_to_json(row)
    INTO _old_value
    FROM (
      SELECT
        u.id,
        u.name,
        u.full_name,
        u.rights,
        u.start_time,
        u.end_time,
        u.group_id,
        g.name as group_name
        FROM um.users as u, um.groups as g
        WHERE u.id = i_id
        AND g.id = u.group_id
    ) row;

  UPDATE um.users AS u
    SET
      name = i_name,
      group_id = i_group_id,
      full_name = i_full_name,
      rights = i_rights,
      "language" = i_language,
      state = i_state,
      start_time = i_start_time,
      end_time = i_end_time
    WHERE u.id = i_id;

  SELECT row_to_json(row)
    INTO _new_value
    FROM (
      SELECT
        u.id,
        u.name,
        u.full_name,
        u.rights,
        u.start_time,
        u.end_time,
        u.group_id,
        g.name as group_name
        FROM um.users as u, um.groups as g
        WHERE u.id = i_id
        AND g.id = u.group_id
    ) row;

  IF _old_value::text <> _new_value::text THEN
    PERFORM 1 FROM log._update_users_log(i_token, _user_id, _rights, i_id, 'UM', 'EDIT_USER', _old_value, _new_value);
  END IF;

END;
$$
LANGUAGE 'plpgsql' VOLATILE SECURITY DEFINER;
