'use strict';
// Make jsonshema from json params

function jsonschema(obj) {
  var methods, m, schema, t;

  if (obj && obj.api) {
    for (var model in obj.api) {
      methods = obj.api[model].methods;
      if (methods) {
        for (var method in methods) {
          m = methods[method]
          if (m.params) {
            schema = {type: "object", properties: {} };
            if (m.required) schema.required = m.required;
            for (var key in m.params) {
              if (typeof m.params[key] == 'string') {
                t = m.params[key];
                if (t == 'date') t = 'string';
                schema.properties[key] = { type: t }; 
              } else {
                schema.properties[key] = m.params[key]; 
              }
            }
            m.jsonschema = schema;
          }
        }
      }
    }
  }
  
  return obj;
}

//var o = yaml2json('./config/config.yaml', '');
//console.log(o.api.users.methods);
module.exports = jsonschema;
