app.factory('api', function($rootScope, $localStorage) {
  
  function jsonrpc2() {
    var id = 1;
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
  
  var ws, reconnect, ping, connectStr;

  var reconnectTimeout = 3000;
  var pingTimeout = 1000;
  var state = false;
  
  var tryTimeout = 100;
  var cbks = {};
  var jsonrpc = jsonrpc2();  
  
  
  $rootScope.$on('$routeChangeSuccess', function(scope, next, current) {
    // Отменить все коллбеки
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
  

/*  
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
  */
  
 
  return function init(connection) {
    
    connectStr = connection;
    connect();
    
    return function api(method, params, cbk) {
        if (state) {
          console.log('z', params);

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
            api(params, method, cbk);
          }, tryTimeout);
        }
    };
  }

  
  
  
  
  
  
  
  
  

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

