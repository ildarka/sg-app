'use strict';

var fs = require('fs');
var yaml2json = require('./build-tasks/yaml2json.js');
var codegen = require('./build-tasks/codegen.js');
var sql = require('./build-tasks/sql.js');


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

// Process database stored functions
sql.sql("./db_sgapp/","postgres://localhost/sgapp");

