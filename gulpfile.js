// Генерация build'a
var path = require('path');
var fs = require('fs');
var util = require('util');
var argv = require('yargs');

var gulp = require('gulp');
var server = require( 'gulp-develop-server' );

// Paths
var paths = {
  config: './config/',
  build_tasks: './build_tasks/',
  database: './database/',
  web: './web/',
  server: './server/',
  public: './server/public/'
};

var concat = require('gulp-concat');
var concatSM = require('gulp-concat-sourcemap');
var ngHtml2Js = require('gulp-ng-html2js');
var rename = require('gulp-rename');
var less = require('gulp-less');
var conf = require(paths.server + 'config.json');

// SG APP build tasks
var yaml2json = require('./build_tasks/yaml2json.js');
var jsonschema = require('./build_tasks/jsonschema.js');
var codegen = require('./build_tasks/codegen.js');
var sql = require('./build_tasks/sql.js');
var rmdir = require('./build_tasks/rmdir.js');

// TASKS
gulp.task('dev', ['client', 'server', 'server:watch', 'client:watch']);
gulp.task('server', ['server:build', 'server:sql', 'server:start']);
gulp.task('client', ['client:clean', 'client:copy', 'client:scripts', 'client:templates', 'client:styles']);
gulp.task('default',['dev']);

  
  gulp.task('server:build', function() {
    // Build json
    var config = yaml2json(paths.config + 'config.yaml');
    var config = jsonschema(config);
    
    var client_config = util._extend({}, config);
    delete client_config.server;
    
    fs.writeFileSync(paths.server + 'config.json', JSON.stringify(config, null, 4));
    fs.writeFileSync(paths.public + 'config.js', 'var config = ' + JSON.stringify(client_config, null, 4)+ ';\n');
    
    // Generate server code
    codegen.generateServer(config.api, paths.server + 'api/');
  });

  // Process database stored functions
  gulp.task('server:sql', function() {
    sql.sql(paths.database,conf.server.connectionString);
  });

  // Run server 
  gulp.task( 'server:start', function() {
      server.listen( { path: paths.server + 'server.js' } );
  });

  gulp.task('client:clean', function() {
    rmdir(paths.public);
    fs.mkdirSync(paths.public);
  });

  // Scripts
  gulp.task('client:scripts', function() {
    gulp.src([
        paths.web + '**/*.js',
        paths.web + '*.js'
      ])
      .pipe(concatSM('all.js'))
      .pipe(gulp.dest(paths.public));
  });

  // Styles
  gulp.task('client:styles', function() {
    gulp.src([
        paths.web + '*.css',
        paths.web + '*.less',
        paths.web + '**/*.css',
        paths.web + '**/*.less'
      ])
      .pipe(less())
      .pipe(concatSM('all.css'))
      .pipe(gulp.dest(paths.public));
  });

  // Combine angular templates into one file
  gulp.task('client:templates', function() {
    gulp.src([paths.web + '**/*.html'])
      .pipe(ngHtml2Js({moduleName: 'templates'}))
      .pipe(concat('templates.js'))
      .pipe(gulp.dest(paths.public));
      //.pipe(livereload({ auto: false }));
  });

  // Client copy files
  gulp.task('client:copy', function() {
     gulp.src([paths.web + '*.html'])
      .pipe(gulp.dest(paths.public));
    
    gulp.src(['bower_components/**/*.*'])
      .pipe(gulp.dest(paths.public + 'lib'));
  });

  // Server watcher
  gulp.task('server:watch', function() {

    gulp.watch([paths.database + '*.*',paths.database +'**/*.*'], ['server:sql', server.restart]);
    gulp.watch([paths.config + '*.*',paths.config + '**/*.*'], ['server:build', server.restart]);

  });

  // Client watcher
  gulp.task('client:watch', function() {
    gulp.watch([paths.web + '*.html', 'bower_components/**/*.*'], ['client:copy']);
    gulp.watch([paths.web + '**/*.html'], ['client:templates']);
    gulp.watch([paths.web + '**/*.js',paths.web + '*.js'], ['client:scripts']);
    gulp.watch([paths.web + '**/*.css',paths.web + '*.css',paths.web + '**/*.less',paths.web + '*.less'], ['client:styles']);
  });
