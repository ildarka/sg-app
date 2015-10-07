app.factory('api', function($rootScope, $localStorage) {
  
  function jsonrpc2() {
    var id = 1;
    return {
      serialize: function(method, params) {

        if (!method) {
          console.error('No method in request');
        }

        var preparedParams = {};
        if (params.token) {
          preparedParams.token = params.token;
        }
        
        // Sanitize params & cast types
        if (method && params && config && config.api) {
          var mm = method.split('.');
          if (config.api[mm[0]]) {
            if (config.api[mm[0]].methods && config.api[mm[0]].methods[mm[1]] && config.api[mm[0]].methods[mm[1]].params) {
              var proto = config.api[mm[0]].methods[mm[1]].params;
              
              for (var key in proto) {
                switch (proto[key]) {
                  case 'number':
                    preparedParams[key] = +params[key];
                    break;
                  case 'boolean':
                    preparedParams[key] = !!params[key];
                    break;
                  default:
                    preparedParams[key] = params[key];
                }
                
              }
            }
          }
        }
        
        var o = {
          method: method,
          id: id++,
          jsonrpc: '2.0',
          params: preparedParams
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
  var silents = {};
  var jsonrpc = jsonrpc2(); 
  
  // Отменить все коллбеки
  $rootScope.$on('$routeChangeSuccess', function(scope, next, current) {
    cbks = {};
    silents = {};
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
              
              if (!silents[data.id]) $rootScope.messageError(data.error);
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
    
    return function api(method, params, cbk, silent) {
      
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
        
          if (typeof silent !== 'undefined') {
            silents[c.id] = true;
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
