'use strict';
var get = function(params, sgApp) {

  var module = 'agg';
  var method = 'get';

  // Get method schema from API. To change edit app/api/agg.yaml
  try {
    var schema = sgApp.api[module][method];
  } catch(e) {
    sgApp.error('Invalid api description in app/api/agg.yaml');
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
}
     
module.exports.get = get;

var subscribe = function(params, sgApp) {

  var module = 'agg';
  var method = 'subscribe';

  // Get method schema from API. To change edit app/api/agg.yaml
  try {
    var schema = sgApp.api[module][method];
  } catch(e) {
    sgApp.error('Invalid api description in app/api/agg.yaml');
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

  // Put your code here
  var result;
  sgApp.response(result);
  }
     
module.exports.subscribe = subscribe;

var add = function(params, sgApp) {

  var module = 'agg';
  var method = 'add';

  // Get method schema from API. To change edit app/api/agg.yaml
  try {
    var schema = sgApp.api[module][method];
  } catch(e) {
    sgApp.error('Invalid api description in app/api/agg.yaml');
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
}
     
module.exports.add = add;

var update = function(params, sgApp) {

  var module = 'agg';
  var method = 'update';

  // Get method schema from API. To change edit app/api/agg.yaml
  try {
    var schema = sgApp.api[module][method];
  } catch(e) {
    sgApp.error('Invalid api description in app/api/agg.yaml');
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

  // Update object in rethinkDB

  r.table(module).get(params._id).update(params).run(conn, function(err, result) {
    if (err) {
      throw err;
    }
    sgApp.response(result);
  });
     
}
     
module.exports.update = update;

var remove = function(params, sgApp) {

  var module = 'agg';
  var method = 'remove';

  // Get method schema from API. To change edit app/api/agg.yaml
  try {
    var schema = sgApp.api[module][method];
  } catch(e) {
    sgApp.error('Invalid api description in app/api/agg.yaml');
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

  // remove object in rethinkDB

  r.table(module).get(params._id).delete().run(conn, function(err, result) {
    if (err) {
      throw err;
    }
    sgApp.response(result);
  });
     
}
     
module.exports.remove = remove;

var licenseadd = function(params, sgApp) {

  var module = 'agg';
  var method = 'licenseadd';

  // Get method schema from API. To change edit app/api/agg.yaml
  try {
    var schema = sgApp.api[module][method];
  } catch(e) {
    sgApp.error('Invalid api description in app/api/agg.yaml');
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

  // Put your code here
  var result;
  sgApp.response(result);
  }
     
module.exports.licenseadd = licenseadd;

var licenseremove = function(params, sgApp) {

  var module = 'agg';
  var method = 'licenseremove';

  // Get method schema from API. To change edit app/api/agg.yaml
  try {
    var schema = sgApp.api[module][method];
  } catch(e) {
    sgApp.error('Invalid api description in app/api/agg.yaml');
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

  // Put your code here
  var result;
  sgApp.response(result);
  }
     
module.exports.licenseremove = licenseremove;

