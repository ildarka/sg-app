app.factory('api', function($rootScope, $localStorage) {
  
  function jsonrpc2() {
    var id = 1;
    return {
      serialize: function(method, params) {

        if (!method) {
          console.error('No method in request');
        }

        var o = {
          method: method,
          id: id++,
          jsonrpc: '2.0',
          params: params
        };

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

        if (o.error) {
          console.error(o.error);
        }

        return o;
      }
    }
  }
  
  var ws, reconnect, ping, connectStr;

  var reconnectTimeout = 3000;
  var pingTimeout = 1000;
  var state = false;
  
  var tryTimeout = 100;
  var cbks = {};
  var jsonrpc = jsonrpc2(); 
  
  // Отменить все коллбеки
  $rootScope.$on('$routeChangeSuccess', function(scope, next, current) {
    cbks = {};
  });

  function connect() {
    
    ws = new WebSocket(connectStr);
    
    if (ws) {
      ws.onopen = function() {
        state = true;
        console.log('Websocket open');
        
        if (reconnect) clearTimeout(reconnect);
        
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
        reconnect = setTimeout(function() {connect();}, reconnectTimeout);
      };

      ws.onerror = function(d) { 
        console.error("Ошибка сокета " + d); 
      };
      
      ws.onmessage = function(e) {
        var data = jsonrpc.parse(e.data);
        console.log('←', JSON.stringify(data));
        if (typeof data.id != 'undefined' && typeof cbks[data.id] === 'function') {
          $rootScope.safeApply(function() {
            
            // Удаление схемы пользователя если он не авторизован на сервере
            if (data.error) {
              if (data.error.code == -32012 && $localStorage.me) {
                $localStorage.me = null;
              }
            }
            
            cbks[data.id](data.error, data.result);
            cbks[data.id] = null;
          });
        }
      };

    } else {
      reconnect = setTimeout(function() {
        connect();
      }, reconnectTimeout);
    }
  }
  
  return function init(connection) {

    connectStr = connection;
    connect();
    
    return function api(method, params, cbk) {
      
      if (state) {
          if (typeof params == 'function') {
            cbk = params;
            params = {};
          }
        
          if ($localStorage.me && $localStorage.me.token) {
            params = params || {};
            params.token = $localStorage.me.token;
          }

          var c = jsonrpc.serialize(method, params);

          if (typeof cbk === 'function') {
            cbks[c.id] = cbk;
          }
          
          console.log('→', JSON.stringify(c));
          ws.send(JSON.stringify(c));

        } else {
          setTimeout(function() {
            api(method, params, cbk);
          }, tryTimeout);
        }
    };
  }
});
