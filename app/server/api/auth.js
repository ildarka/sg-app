'use strict';
var login = function(params, sgApp) {

  var module = 'auth';
  var method = 'login';

  // Get method schema from API. To change edit app/api/auth.yaml
  try {
    var schema = sgApp.api[module][method];
  } catch(e) {
    sgApp.error('Invalid api description in app/api/auth.yaml');
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
     
module.exports.login = login;

var logout = function(params, sgApp) {

  var module = 'auth';
  var method = 'logout';

  // Get method schema from API. To change edit app/api/auth.yaml
  try {
    var schema = sgApp.api[module][method];
  } catch(e) {
    sgApp.error('Invalid api description in app/api/auth.yaml');
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
     
module.exports.logout = logout;

