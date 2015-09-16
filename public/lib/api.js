app.factory('api', function($rootScope) {
  var ws, ws_state = [
      "СОЕДИНЕНИЕ... [соединение ещё не было установлено]",
      "СОКЕТ ОТКРЫТ [соединение установлено, и возможен обмен данными]",
      "ЗАКРЫТИЕ... [идёт процедура закрытия сокета]",
      "ЗАКРЫТО [соединение закрыто или не может быть открыто]"
  ];
  
  // JSONRPC2 errors, from http://www.jsonrpc.org/specification
  var PARSE_ERROR = -32700;
  var INVALID_REQUEST = -32600;
  var METHOD_NOT_FOUND = -32601;
  var INVALID_PARAMS = -32602;
  var INTERNAL_ERROR = -32603;

  // JSONRPC2 custom errors.
  var LOGIN_FAILED = -32000;
  var UNAUTHORIZED = -32001;
  var FORBIDDEN = -32002;
  var USER_DUPLICATE = -32003;
  var GROUP_DUPLICATE = -32004;
  var USER_NOT_FOUND = -32005;
  var GROUP_NOT_FOUND = -32006;
  var OLD_PASSWORD_INCORRECT = -32007;
  var UNKNOWN_GROUP = -32008;
  var RULE_DUPLICATE = -32009;
  var RULE_NOT_FOUND = -32010;
  var RULES_GROUP_DUPLICATE = -32011;
  var RULES_GROUP_NOT_FOUND = -32012;
  var SESSION_DUPLICATE = -32013;
  var SESSION_NOT_FOUND = -32014;
  var QUERY_NOT_FOUND = -32015;
  var DEVICE_DUPLICATE_IP = -32016;
  var DEVICE_DUPLICATE_NAME = -32017;
  var DEVICE_NOT_FOUND = -32018;
  var UNKNOW_RECORD = -32019;
  var BAD_REQUEST = -32020;
  var MISS_CONFIGURATION = -32021;

  $rootScope.$on('$routeChangeSuccess', function(scope, next, current) {
    // Отменить все коллбеки
  });


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

function WSS(connection) {
  var ws, reconnect, ping;

  var reconnectTimeout = 3000;
  var pingTimeout = 1000;
  var state = false;
  
  function connect() {
    ws = new WebSocket(connection);

    var WSObj = {
      ws: ws,
      ready: function() {
        return state;
      },
      send: function(data) {
        console.log('→', JSON.stringify(data));
        this.ws.send(JSON.stringify(data));
      },
      onmessage: function(cbk) {
        this.ws.onmessage = function(e) { 
          cbk(e.data);
        };
      }
    };
    
    if (ws) {
      ws.onopen = function() {
        state = true;
        console.log('Websocket open');
        
        if (reconnect) clearInterval(reconnect);
        
        if (!ping) {
          ping = setInterval(function() {
            ws.send('ping');
          }, pingTimeout);
        }
      };

      ws.onerror = function(d) { console.error("Ошибка сокета " + d); };

      ws.onclose = function() { 
        state = false;
        console.log('Connection closed');
        if (ping) clearInterval(ping);
        reconnect = setTimeout(function() {connect();}, reconnectTimeout);
      };

    } else {
      reconnect = setTimeout(function() {connect();}, reconnectTimeout);
    }
    
    return WSObj;
  }
  
  return connect();
}

  
function api(connection) {
  
  var tryTimeout = 100;
  
  var cbks = {};
  
  var jsonrpc = jsonrpc2();
  
  var ws = WSS(connection);
  
  ws.onmessage(function(data) {

    console.log('data', data);
    
    data = jsonrpc.parse(data);
    if (data.id && typeof cbks[data.id] === 'function') {
      cbks[data.id](data.error, data.result);
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

  return api;
}

return api;  

/*            
  
  var command = {
    set_transport: function(t) {
      self = this;
      if (typeof t != "object") {
        transport = "ajax";
        url = t;
      } else {
        transport = "websockets";
        ws = t;
        ws.onopen    = function()  { console.log("ВЕБСОКЕТ ОТКРЫТ"); };
        ws.onerror   = function(d) { console.log("Ошибка сокета " + d); };
        ws.onmessage = function(d) { self.process_result(JSON.parse(d.data)); };
        ws.onclose   = function(d) { console.log("ВЕБСОКЕТ ЗАКРЫТ"); };
        //$(window).unload(function() { self.send("close"); ws.close(); });
        setInterval(function() { self.send("heart_beat"); }, 5000);
      }
      console.log("Transport: " + transport);
    },
    serialize: function(query, proto) {
      var params = {};
      for (var key in proto) {
        if(angular.isFunction(proto[key])) {
          params[key] = proto[key](query[key]);
        } else {
          console.error("Unsupported type in proto", proto);
          break;
        }
      }
      return params;
    },
    deserialize: function(result, proto) {
      for (var key in proto) {
        if(result[key]) {
          switch(proto[key]) {
            case "date":
              result[key] = new Date(result[key]);
              break;
          }
        }
      }
      return result;
    },
    deserialize_set: function(result, proto) {
      result.map(function(i) {command.deserialize(i, proto);});
      return result;
    },
    exec: function(method, data, options) {
      return this.send(method, $.extend({ data: data }, options));
    },
    fileurl: function(name) {
      var params = (
        "?file_name=" + encodeURIComponent(name) +
        "&token=" + encodeURIComponent($localStorage.my.token)
      );
      return url + params;
    },
    send: function(method, opts) {
      self = this;
      opts = opts || {};

      var deferred = $q.defer();
      deferreds[id] = deferred;

      if (typeof opts.success === 'function') {
        stack_success[id] = opts.success;
      }

      var request = {
        jsonrpc : '2.0',
        method  : method,
        params  : $.extend( {}, opts.data),
        id      : Math.abs(id++)
      };

      if (typeof moomoomoo === "undefined") console.log('⌘ ', request.id, method, JSON.stringify(request.params));

      if (!opts.global) {
        promises.push(deferred);
      }

      var cache_hash;
      if (opts.cache) {
        cache_hash = generate_cache_hash(method, opts.data);
        var cached_response = cache('command').get(cache_hash);
        if (!angular.isUndefined(cached_response)) {
          console.log('← ', request.id, 'from cache:');
          self.process_result({ id: request.id, result: cached_response });
          return deferred.promise;
        }
      }

      if ($localStorage.my) {
        request.params.token = $localStorage.my.token;
      }

      request = JSON.stringify(request);

      if (transport === 'ajax') {
        $http.post(url, request).success( function(resp) { self.process_result(resp, cache_hash); });
      } else {
        ws.send(request);
      }

      return deferred.promise;
    },
    process_result:function(resp, cache_hash) {
      if (typeof moomoomoo === "undefined") console.log("← ", resp.id, resp.result || resp.error);

      var deferred = deferreds[resp.id];
      var on_success = stack_success[resp.id];
      function success(result) {
        if (isset(on_success)) {
          on_success(result);
        }
        promises.remove(deferred);
        deferred.resolve(result);
      }

      function error(resp) {
        promises.remove(deferred);
        deferred.reject(result);
      }

      // Запрос выполнен успешно
      if (resp.result) {
        if (cache_hash) {
          cache('command').put(cache_hash, angular.copy(resp.result));
        }
        success(resp.result);
      } else {

        // Запрос вернул ошибку
        switch(resp.error.code) {

          // Неизвестная пара логин/пароль
          case LOGIN_FAILED:
            if ($location.path() === "/" && isset(stack_success[resp.id])) stack_success[resp.id](resp.error);
            if ($location.path() !== "/error" && $location.path() !== "/") messagebox.show_error(resp.error);
            break;

          // Неавторизован
          case UNAUTHORIZED:
            // исключаем зацикленность
            // $rootScope.logout() => auth.logout => $rootScope.logout()
            if (resp.method !== 'auth.logout') $rootScope.logout();
            break;

          // Прочие ошибки
          default:
            messagebox.show_error(resp.error);
        }

        if (deferred) {
          promises.remove(deferred);
          deferred.reject(resp);
        }
      }

      if (isset(stack_success[resp.id])) { delete(stack_success[resp.id]); }
      delete deferreds[resp.id];
    }
  };
  return command;
  
*/
            
});

