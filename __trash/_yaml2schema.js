'use strict';
// Json Shema Generator from Yaml API description

var yamli = require('yamli');
var deref = require('json-schema-deref-local');

var yaml2shema = function(src) {
  // Load Yaml file with !include
  var jsonshema = yamli.load(src);

  // Deref json schema
  var jsonshemaDeref = deref(jsonshema);
  //console.log(jsonshemaDeref);

  return jsonshemaDeref;
};

module.exports = yaml2shema;