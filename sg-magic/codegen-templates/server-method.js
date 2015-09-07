var {{method}} = function(params, sgApp) {

  var module = '{{module}}';
  var method = '{{method}}';

  // Get method schema from API. To change edit app/api/{{module}}.yaml
  try {
    var schema = sgApp.api[module][method];
  } catch(e) {
    sgApp.error('Invalid api description in app/api/{{module}}.yaml');
    return false;
  }

  // Params validation
  if (schema.params) {
    var valid = sgApp.validate(params, schema.params);
    if (!valid.status) {
      sgApp.error('Invalid params', valid.error);
      return false;
    }
  }

  // Access control
  if (schema.access) {
    var access = sgApp.accessControl(user, schema.access);
    if (!access) {
      sgApp.error('Access forbidden');
      return false;
    }
  }

  {{#if is.get}}
  // Get data from rethinkDB

  if (schema.response) {
    // Filter response
    var response = schema.response;

    sgApp.r.table(module).pluck(response).run(sgApp.conn, function(err, result) {
      if (err) {
        throw err;
      }
      sgApp.response(result);
    });
  } else {
    // Return all data
    sgApp.r.table(module).run(sgApp.conn, function(err, result) {
      if (err) {
        throw err;
      }
      sgApp.response(result);
    });
  }
  {{else if is.add}}
  // Add object to rethinkDB

  // Insert _date if not present
  if (schema.params) {
    if (schema._date && !params._date) params._date = new Date();
  }

  r.table(module).insert(params).run(conn, function(err, result) {
    if (err) {
      throw err;
    }
    sgApp.response(result);
  });
  {{else if is.update}}
  // Update object in rethinkDB

  r.table(module).get(params._id).update(params).run(conn, function(err, result) {
    if (err) {
      throw err;
    }
    sgApp.response(result);
  });
     
  {{else if is.remove}}
  // remove object in rethinkDB

  r.table(module).get(params._id).delete().run(conn, function(err, result) {
    if (err) {
      throw err;
    }
    sgApp.response(result);
  });
     
  {{else}}
  // Put your code here
  var result;
  sgApp.response(result);
  {{/if}}
}
     
module.exports.{{method}} = {{method}};
