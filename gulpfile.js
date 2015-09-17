// Генерация build'a
var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
var bower = require('gulp-bower');
var server = require( 'gulp-develop-server' );

var yaml2json = require('./build-tasks/yaml2json.js');
var codegen = require('./build-tasks/codegen.js');
var sql = require('./build-tasks/sql.js');


  /*    
      concat        = require('gulp-concat'),
      concatSM      = require('gulp-concat-sourcemap'),
      less          = require('gulp-less'),
      livereload    = require('gulp-livereload'),
      ngHtml2Js     = require('gulp-ng-html2js'),
      symlink       = require('gulp-symlink'),
      repl          = require('gulp-replace'),
      rename        = require('gulp-rename'),
  */    



// TASKS
gulp.task('dev', ['server:build', 'server:sql', 'server:start', 'server:watch']);
gulp.task('default',['dev']);


  // Clean
  gulp.task('clean', function() {
    var rmDir = function(dirPath) {
      try       { var files = fs.readdirSync(dirPath); }
      catch (e) { return; }

      if (files.length > 0) {
        for (var i = 0; i < files.length; ++i) {
          var filePath = dirPath + '/' + files[i];
          if ( fs.lstatSync(filePath).isFile() || fs.lstatSync(filePath).isSymbolicLink() ) {
            fs.unlinkSync(filePath);
          } else {
            rmDir(filePath);
          }
        }
      }
      fs.rmdirSync(dirPath);
    };
    rmDir('build');
  });
  
  gulp.task('server:build', function() {
    // Build json
    var config = yaml2json('./config/config.yaml');
    var api = yaml2json('./config/api.yaml');
    fs.writeFileSync('server/config.json', JSON.stringify(config, null, 4));
    fs.writeFileSync('public/apiSchema.js', 'var apiSchema = ' + JSON.stringify(api, null, 4)+ ';\n');

    // Generate server code
    codegen.generateServer(api, './server/api/');
  });

  // Process database stored functions
  gulp.task('server:sql', function() {
    sql.sql("./db_sgapp/","postgres://localhost/sgapp");
  });

  // Run server 
  gulp.task( 'server:start', function() {
      server.listen( { path: './server/server.js' } );
  });

  // Watchers
  gulp.task('server:watch', function() {

    gulp.watch(['db_sgapp/*.*','db_sgapp/**/*.*'], ['server:sql', server.restart]);
    gulp.watch(['config/*.*','config/**/*.*'], ['server:build', server.restart]);

  });

