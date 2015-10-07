var fs = require('fs');
var path = require('path');

var express = require('express');
var app = express();

var Busboy = require('busboy');
var ajv = require('ajv')();

var JsonRpcWs = require('json-rpc-ws');
var server = JsonRpcWs.createServer();

var massive = require('massive');

var config = require('./config.json');

var public = path.resolve(__dirname + '/public/');

// Online users in memory
var onlineusers = {};

// Remove expired tokens every minute
setInterval(function clearTokens() {
  for(var key in onlineusers) {
    if (new Date() - onlineusers[key].time > config.server.expireToken) delete(onlineusers[key]);
  }
}, 60000);

// Expose websocket jsonrpc api by API methods
function expose(server, model, method, fn) {
    server.expose(model + '.' + method, function(params, reply) {
      
      console.log(model + '.' + method);
      
      // Prepare token
      var token = null;
      if (params && params.token) {
        token = params.token;
        delete(params.token);
      }
      
      // Prolongate session
      if (onlineusers[token]) {
        onlineusers[token].time = new Date();
      }

      // Prepare sgapp global object
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
          if (err.message in config.errors) {
            reply(config.errors[err.message], null); 
          } else {
            reply(err, null);
          }
        },
        ACL: function() {
          if (this.schema && this.schema.access) {
            if (!token) {
              this.error(config.errors['UNAUTORIZED']); 
            } else {
              if (!this.onlineusers[token]) {
                this.error(config.errors['UNAUTORIZED']); 
              } else {

                var u = this.onlineusers[token];
                console.log('--', u.role, this.schema.access, this.schema.access.indexOf(u.role));
                if (this.schema.access.indexOf(u.role) == -1) {
                  console.log(4);
                  this.error(config.errors['FORBIDDEN']); 
                }
              }
            }
          }
          
          return true;
        },
        validate: function() {

          if (this.ajv) {
            var valid = this.ajv(this.params);
            if (!valid) {
              console.log('VALIDATION', this.ajv.errors);
              this.error(config.errors['INVALID_PARAMS']);
            }
            return valid;
          } else {
            return true;  
          }
        }
      };
      
      // Insert compiled jsonschema validator sgapp.ajv 
      if (sgapp.schema && sgapp.schema.jsonschema) sgapp.ajv = ajv.compile(sgapp.schema.jsonschema);
      //console.log('SGAPP', sgapp.schema, sgapp.ajv);
      
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

// Connect to PostgreSQL & Start websocket + http servers
var db = massive.connectSync({connectionString : config.server.connectionString});
if (!db) {
  console.error('PostgreSQL "sgapp" database not found!');
  process.exit(1);
} else {
  console.log('Connected to  PostgreSQL "sgapp" database');
  server.start({ port: config.wsport }, function started () {
    console.log('Websocket server started on port', config.wsport);
    
    app.listen(config.port, function() {
      console.log('Http server started on ', config.port);
    });
  });
}

/*
  Put your code here -----------------------------------
*/

// Static folders
app.use(express.static(public));
app.use('/software', express.static(__dirname + '/software/'));
app.use('/license', express.static(__dirname + '/license/'));

// Endpoint for upload files
app.post('/uploadFiles', function(req, res) {
  var busboy = new Busboy({ headers: req.headers });
  var files = 0, finished = false;
  busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);
    ++files;
    var fstream = fs.createWriteStream(__dirname + '/pcap/' + filename);
    fstream.on('finish', function() {
      if (--files === 0 && finished) {
        res.writeHead(200, { 'Connection': 'close' });
        res.end("");
      }
    });
    file.pipe(fstream);
  });
  busboy.on('finish', function() {
    finished = true;
  });
  return req.pipe(busboy);
});
