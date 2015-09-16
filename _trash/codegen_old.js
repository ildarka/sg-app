'use strict';
// Json Shema Generator from Yaml API description

var fs = require('fs');
var Handlebars = require('handlebars');

var source = fs.readFileSync('codegen-server/method.tpl','utf-8');
var template = Handlebars.compile(source);

var codegenServer = function(schema, folder) {

  //console.log(schema);
  for (var key in schema) {
    if (schema[key]['methods']) {
      console.log('Find module', key);
      var str = "'use strict';\n";
      
      //if (!fs.existsSync(folder + key + '.js')) {
      {
        var methods = schema[key]['methods'];
        
        for (var method in methods) {
          var codegenbody = (fs.existsSync('codegen-server/' + method + '.tpl')) ? fs.readFileSync('codegen-server/' + method + '.tpl','utf-8') : false; 
          console.log(codegenbody);
          var result = template({method: method, module: key, codegenbody: codegenbody});
          str += result + '\n';
          //console.log('Codegen method', key + '.' + method, result);
        }
      }
      fs.writeFileSync(folder + key + '.js', str);
      
    }
  }

  return ;
  
};

var data = fs.readFileSync('../build/schema.json','utf-8');
var schema = JSON.parse(data);

codegenServer(schema,'../app/server/api/');


//module.exports = yaml2shema;