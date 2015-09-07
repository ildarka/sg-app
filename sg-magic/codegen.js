'use strict';
// Json Shema Generator from Yaml API description

var fs = require('fs');
var Handlebars = require('handlebars');

var serverApi = Handlebars.compile(fs.readFileSync('./sg-magic/codegen-templates/server-api.js','utf-8'));
var serverMethod = Handlebars.compile(fs.readFileSync('./sg-magic/codegen-templates/server-method.js','utf-8'));
var dev = Handlebars.compile(fs.readFileSync('./sg-magic/codegen-templates/dev.html','utf-8'));


var generateServer = function(schema, folder) {
  var modules = [];
  console.log(schema);
  for (var key in schema.api) {
    if (schema.api[key]['methods']) {
      console.log('Find module', key);
      modules.push({module: key});
      
      var str = "'use strict';\n";
      //if (!fs.existsSync(folder + key + '.js')) {
      {
        var methods = schema.api[key]['methods'];
        
        for (var method in methods) {
          var is = {};
          is[method] = true;
          
          var result = serverMethod({method: method, module: key, is: is});
          
          str += result + '\n';
          //console.log('Codegen method', key + '.' + method, result);
        }
      }
      fs.writeFileSync(folder + key + '.js', str);
    }
  }
  fs.writeFileSync(folder + 'api.js', serverApi({modules: modules}));
}

var generateDev = function(schema, dst) {

  fs.writeFileSync(dst, dev({schema: schema}));
}

module.exports.generateServer = generateServer;
module.exports.generateDev = generateDev;
  