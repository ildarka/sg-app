var express = require('express');
var app = express();

var JsonRpcWs = require('json-rpc-ws');
var server = JsonRpcWs.createServer();

var config = require('./config.json');

app.listen(config.port, function() {
  console.log('Webserver started on ', config.port);
});

var rpc = {
  error: function(err) {
    this.reply(err, null);
  },
  send: function(data) {
    this.reply(null, data);
  }
};

// Контейнер для пользователей online
var onlineusers = {};

function apifunc(rpc) {
// rpc contains db, send, error, model, method, methodname
  
      var newUser = {
        username: rpc.params.username,
        password: rpc.params.password,
        state: 'NEW',
        date: new Date()
      }
      
      rpc.db.saveDoc("users", newUser, function(err, res) {
        rpc.send("OK");
      });
}

// expose API methods
function expose(server, model, method, fn) {
    server.expose(model + '.' + method, function(params, reply) {
      
      console.log(model + '.' + method);
  
      sgapp = {
        params: params,
        schema: config.api[model].methods[method],
        db: db,
        onlineusers: onlineusers,
        model: model,
        method: method,
        methodname: model + '.' + method,
        errors: 0,
        send: function(data) {
          reply(null, data);
        },
        error: function(err) {
          this.errors++;
          reply(err, null);
        },
        accessControl: function() {
          return true;
        },
        validate: function() {
          return true;
        }
      };
      
      //apifunc(rpc);
      fn(sgapp);
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


var massive = require("massive");
var connectionString = "postgres://postgres:1@localhost/sgapp"
var connectionString = "postgres://localhost/sgapp"


var db = massive.connectSync({connectionString : connectionString});

//you can use db for 'database name' running on localhost
//or send in everything using 'connectionString'
massive.connect({connectionString : connectionString}, function(err,db) {
  //console.log(db.tables);
/*
  db.newusers.find( function(err,res){
    console.log(res);
    //user with ID 1
  });
  */
});


    console.log('Connected to DB');

    server.start({ port: config.wsport }, function started () {
      
      console.log('Websockets started on port', config.wsport);
    
    });
