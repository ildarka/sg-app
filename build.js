'use strict';

var fs = require('fs');
var yaml2json = require('./build-tasks/yaml2json.js');
var codegen = require('./build-tasks/codegen.js');
/*
// Generate Json config
function generateConfig(src, dst) {
  var schema = yaml2schema(src);
  fs.writeFileSync(dst, JSON.stringify(schema, null, 4));
  return schema;
}
*/

// Generate Server Code
function generateServer(schema, dst) {
  codegen.generateServer(schema, dst);
}

// Build json
var config = yaml2json('./config/config.yaml');
var api = yaml2json('./config/api.yaml');
fs.writeFileSync('server/config.json', JSON.stringify(config, null, 4));
fs.writeFileSync('public/apiSchema.js', 'var apiSchema = ' + JSON.stringify(api, null, 4)+ ';\n');

// Generate server code
codegen.generateServer(api, './server/api/');

