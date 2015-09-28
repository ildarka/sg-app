'use strict';

var list = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  if (!sgapp.errors) {
    var fs = require('fs');
    var path = sgapp.dirname + '/software/';
    fs.readdir(path, function(err, res) {
      if (err) {
        console.log('is list', err);
      } else {
        var r = [];
        console.log('res', res);
        res.forEach(function(f, index) {
            fs.stat(path + f, function(err, result) {
              if (err) {
                throw(err);
              } else {
                r.push({file: f, date: result.mtime});
                if (r.length == res.length) {
                  console.log('r', r, index, res.length);
                  sgapp.send(r, index);
                }
              }
            });
        });
      }
    }); 
  }
};


module.exports.list = list;
