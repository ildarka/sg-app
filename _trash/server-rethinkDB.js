var express = require('express');
var app = express();

var JsonRpcWs = require('json-rpc-ws');
var server = JsonRpcWs.createServer();

var r = require('rethinkdb');

var sgApp = require('./sg-app.js');
var config = require('./config.json');

sgApp.config = config;

app.listen(config.port, function() {
  console.log('Webserver started on ', config.port);
});

// expose API methods

function expose(server, model, method, fn) {
    server.expose(model + '.' + method, function(params, reply, sgApp) {
      
      console.log(model + '.' + method);
      //api[model][method]();
    
    });
}

for (var model in config.api) {
  var apimodel = require('./api/' + model + '.js');
  for(method in config.api[model].methods) {
    expose(server, model, method, apimodel[method]);
  }
}

server.expose('mirror', function mirror (params, reply) {
    console.log('mirror handler', params);
    reply(null, params);
});

app.use(express.static(__dirname + '/../public/'));

// Connect to RethinkDB
r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;

    sgApp.r = r;
    sgApp.conn = conn;

    console.log('Connected to rethinkDB');

    server.start({ port: config.wsport }, function started () {
      
      console.log('Websockets started on port', config.wsport);
    
    });
  
});
