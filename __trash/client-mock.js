function jsonrpc2() {
  var id = 0;
  return {
    serialize: function (method, params) {
      
      if (!method) {
        console.error('No method in request');
      }
      
      var o = {
        method: method,
        id: id++,
        jsonrpc: '2.0'
      }
      
      if (params) o.params = params;
      
      return o;
    },
    
    parse: function(data) {
      var o;
    
      if (typeof data === 'string') {
        try {
          o = JSON.parse(data);
        } catch(e) {
          console.error(e);
        }
      }
      
      if (!o.method) {
        console.error('No method in response!');
      }
      
      if (o.error) {
        console.error(o.error.code, o.error.message);
      }
      
      return o;
    }
  }
}

function ws(connection, cb) {
  var try = 0;
  var reconnect = 500;
  var ping;
  var pingTimeout = 200;
  var state = false;
  
  var ws = new WebSocket(connection);

  ws.onopen = function() {
    state = true;
    if (!ping) {
      ping = setInterval(function() {
        ws.send('ping');
      }, pingTimeout);
    }
  };
  
  ws.onclose = function() { 
    state = false;
    console.log('Connection closed');
    if (ping) clearInterval(ping);
    ping = null;
  };

  return {
    ready: function() {
      return state;
    },
    send: function(data) {
      ws.send(data);
    },
    onmessage(cb) {
      ws.onmessage = function(e) { 
        cb(e.data);
      };
    }
  }
}

function api(connection) {
  
  var tryTimeout = 100;
  
  var cbks = {};
  
  var jsonrpc = jsonrpc2();
  var ws = ws();
  
  ws.onmessage(function(data) {
    data = jsonrpc2.parse(data);
    if (data.id && typeof cbks[data.id] === 'function') {
      cbks[data.id](data.result);
      cbks[data.id] = null;
    }
  });
  
  var api = function api(method, params, cbk) {

      if (ws.ready()) {
        var c = jsonrpc.serialize(method, params);
        if (typeof cbk === 'function') {
          cbks[c.id] = cbk;
        }
        ws.send(c);
      } else {
        setTimeout(function() {
          api(params, method, cbk);
        }, tryTimeout);
      }
    }
  }

  return api;
}
