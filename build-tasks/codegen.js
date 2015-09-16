'use strict';
// Json Shema Generator from Yaml API description

var fs = require('fs');
var Handlebars = require('handlebars');

// Template files
var serverMethod = Handlebars.compile(fs.readFileSync('./build-tasks/codegen-templates/server-method.js','utf-8'));
var serverModule = Handlebars.compile(fs.readFileSync('./build-tasks/codegen-templates/server-module.js','utf-8'));

var generateServer = function(api, folder) {
  for (var key in api) {
    if (api[key]['methods']) {
      var methodsArr = [];
      console.log('Find module', key);
      
      //if (!fs.existsSync(folder + key + '.js')) {
      {
        var methods = api[key]['methods'];
        
        for (var method in methods) {
          var is = {};
          is[method] = true;
          var result = serverMethod({method: method, module: key, is: is});
          methodsArr.push({methodname: method, methodbody: result});
          //console.log('Codegen method', key + '.' + method, result);
        }
        
        var m = serverModule({methods: methodsArr, module: key});
        fs.writeFileSync(folder + key + '.js', m);
      }
    }
  }
}

module.exports.generateServer = generateServer;
  