/*
  Websocket Jsonrpc2 Server  
*/

var WebSocketServer = require('ws').Server;
var jsonrpc = require('jsonrpc2');

var api = {};

function listen(port) {
  var wss = new WebSocketServer({ port: port });

  wss.on('connection', function connection(ws) {
    console.log('received: %s', message);
    var rpc = jsonrpc.request(message);
    if (typeof api[rpc.method] == 'function') {
      api[rpc.method](rpc.params, res);
    }
  });
}

function register(methodName, method) {
  if (methodName && typeof method === 'function') {
    api[methodName] = method;
  } else if (methodName && typeof method === 'object') {
    for (key in method) register(methodName + '.' + key, method[key]);
  }
}



wss.on('connection', function connection(ws) {

var res = {
  id: null,
  send: function(data) {
    ws.send(jsonrpc2.result(data, this.id));
  },
  error: function(err) {
    ws.send(jsonrpc2.error(err, this.id));
  },
  
};

var rpc;
  
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    try {
      rpc = JSON.parse(message);    
    } catch (e) {
      rpc = false;
    }

    if (rpc && rpc.jsonrpc && rpc.id) {
      res.id = rpc.id;
      
      if (!rpc.method) {
        res.error();
      }
      if (typeof api[rpc.method] != 'function') {
        res.error();
      }
      api[rpc.method](rpc.params, res);
    }
  });
});

api['users.get'] = function(params, res) {
  res.send(data);
}
