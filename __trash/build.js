'use strict';

var fs = require('fs');
var yaml2schema = require('./sg-magic/yaml2schema.js');
var codegen = require('./sg-magic/codegen.js');

// Generate Json config
function generateConfig(src, dst) {
  var schema = yaml2schema(src);
  fs.writeFileSync(dst, JSON.stringify(schema, null, 4));
  return schema;
}

// Generate Server Code
function generateServer(schema, dst) {
  codegen.generateServer(schema, dst);
}

var schema = generateConfig('./config/config.yaml', './app/config.json');

codegen.generateServer(schema, './app/server/api/');

