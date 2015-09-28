var path = require('path');
var express = require('express');
var app = express();

var JsonRpcWs = require('json-rpc-ws');
var server = JsonRpcWs.createServer();

var config = require('./config.json');
var public = path.resolve(__dirname + '/public/');



app.listen(config.port, function() {
  console.log('Webserver started on ', config.port);
});

/*
var rpc = {
  error: function(err) {
    this.reply(err, null);
  },
  send: function(data) {
    this.reply(null, data);
  }
};

function apifunc(rpc) {
// rpc contains db, send, error, model, method, methodname
  
      var newUser = {
        name: rpc.params.name,
        password: rpc.params.password,
        state: 'NEW',
        date: new Date()
      }
      
      rpc.db.saveDoc("users", newUser, function(err, res) {
        rpc.send("OK");
      });
}
*/

// Контейнер для пользователей online
var onlineusers = {};



// expose API methods
function expose(server, model, method, fn) {
    server.expose(model + '.' + method, function(params, reply) {
      
      console.log(model + '.' + method);
      
      var token = null;
      if (params && params.token) {
        token = params.token;
        delete(params.token);
      }
      
      sgapp = {
        dirname: __dirname,
        params: params,
        token: token,
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
        ACL: function() {
          if (this.schema && this.schema.access) {
            if (!token) {
              this.error('Forbbiden'); 
            } else {
              if (!this.onlineusers[token]) {
                this.error('Forbbiden'); 
              } else {

                var u = this.onlineusers[token];
                console.log('--', u.role, this.schema.access, this.schema.access.indexOf(u.role));
                if (this.schema.access.indexOf(u.role) == -1) {
                  console.log(4);
                  this.error('Forbbiden'); 
                }
              }
            }
          }
          
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

// Expose api functions
for (var model in config.api) {
  var apimodel = require('./api/' + model + '.js');
  for(method in config.api[model].methods) {
    expose(server, model, method, apimodel[method]);
  }
}

// Return index.html for all routes
for (var url in config.routes) {
  app.get(url, function (req, res) {
    res.sendFile(public + '/index.html');
  });
};

app.use(express.static(public));
app.use('/software', express.static(__dirname + '/software/'));
app.use('/license', express.static(__dirname + '/license/'));

var massive = require("massive");

var db = massive.connectSync({connectionString : config.server.connectionString});
if (!db) {
  console.error('Postgres sgapp database not found!');
  process.exit(1);
} else {
  console.log('Connected to DB');
  server.start({ port: config.wsport }, function started () {
    console.log('Websockets started on port', config.wsport);
  });
}

