'use strict';
var fs = require('fs');
var pg = require('pg');

function processpath(path, db) {
      fs.readdir(path, function(err, files) {
      files.forEach(function(f) {
        fs.readFile(path + f, "utf8", function(err, sql) {
          if (f[0] != '_' && f[0] != '.') {
            if (fs.lstatSync(path+f).isDirectory()) {
              processpath(path+f+'/', db);
            } else {
              
              db.query(sql, function(err, res) {
                if (err) {
                  console.error(f, err);
                } else {
                  console.log(f, 'OK');
                }
              });
            }
          }
        });
      });
    });
}

function sql(path, connectionString) {

  pg.connect(connectionString, function(err, db) {
    if (err) {
      console.error('Postgres sgapp database not found!');
      process.exit(1);
    } else {
      processpath(path, db);    
    }
  });
}


//sql("./db_sgapp/","postgres://localhost/sgapp");
//var o = yaml2json('./config/config.yaml', '');
//console.log(o.api.users.methods);
module.exports.sql = sql;