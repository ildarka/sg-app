'use strict';
var fs = require('fs');
var yaml = require('js-yaml');

function getpath(path) {
  var pos = path.lastIndexOf('/');
  return (pos != -1) ? path.substring(0, pos+1) : '';
}

function deref(obj, path) {

  function scan(o) {
    var elem;
    for(var key in o) {
      elem = o[key];
      if (typeof elem === 'object') scan(elem);
      if (typeof elem === 'string' && elem.substring(0,4) == '$ref') {
        var ref = elem.substring(4).trim();
        var target = ref;
        if (elem.indexOf('.yaml')!=-1 || elem.indexOf('.yml')!=-1) {
          // File $ref
          if (fs.existsSync(path + ref)) {
            target = yaml2json(path + ref);
          } else {
            console.error('File ref not exists', path + ref);
          }
        } else {
          // Local $ref
          target = obj;
          var p = ref.split('/');
          p.forEach(function(i) {
            //console.log('##', target, i, p);
            if (i in target) { 
              target = target[i]; 
            } else console.error('Wrong local ref', ref);
          });
        }
        o[key] = target;
      }
    }
  }

  scan(obj);
  return obj;
}

function yaml2json(src, dst) {
  var path = getpath(src);
  var content = fs.readFileSync(src, 'utf8');
  var o = yaml.load(content);
  o = deref(o, path);
  
  if (dst) {
    fs.writeFileSync(dst, o);
  }
  return o;
}

//var o = yaml2json('./config/config.yaml', '');
//console.log(o.api.users.methods);
module.exports = yaml2json;