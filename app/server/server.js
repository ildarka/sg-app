var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var r = require('rethinkdb');

server.listen(3000);

app.use(express.static(__dirname));


var config = require('../config.json');
var sgApp = require('../../sg-magic/sgapp.js');


app.use(express.static(__dirname + '../../client'));
app.use(express.static(__dirname + '../../bower_components'));

var api = {};
for (model in config.api) {
  api[model] = require('./api/' + model + '.js');
}

console.log(api['auth']['login']);

// Connect to RethinkDB
r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    sgApp.r = r;
    sgApp.conn = conn;

    console.log('Connected to database');
    // Register API functions
    io.on('connection', function (socket) {
      console.log('connection…');
      sgApp.socket = socket;
      
      for (key in config.api) {
        for (method in config.api[key].methods) {
          var methodname = key + '.' + method;
          console.log(methodname);
          
          (function(key, method, methodname) {
            socket.on(methodname, function(data) {

              console.log(data, methodname, key, method);

              try {
                var dataJ = JSON.parse(data);
              } catch(e) {
                console.log(e);
                throw(e);
              }

              var params = dataJ.params;

              //console.log(params, key, method, api[key][method]);
              api[key][method](params, sgApp);

            });
          })(key, method, methodname);
          
          
        }
      }
    });
});

