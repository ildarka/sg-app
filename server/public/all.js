var app = angular.module("app",['ngRoute', 'ngAnimate', 'ngStorage', 'templates']);

app.controller("appCtrl", function($rootScope, $window, $location, $filter, $http, $timeout, $localStorage, api) {

  // Return current user object
  $rootScope.me = function() {
    return $localStorage.me;
  };

  // Access control
  $rootScope.ACL = function(access, debug) {
    if (debug) console.log(access, access.indexOf($localStorage.me.role) !== -1);
    if (!access) return true;
    if (!$localStorage.me) return false;
    return (access.indexOf($localStorage.me.role) !== -1);
  };  

  $rootScope.scrollTop = function() {
    $window.scrollTo(0,0);
  }

  $rootScope.findRoute = function() {
    var url = $location.path();
    if (url in $rootScope.config.routes) {
      $rootScope.route = $rootScope.config.routes[url];
    } else {
      console.error('Route '+ url + ' not found!');
    }
  };
    
  // Отработка начала перехода на новый скрин
  $rootScope.$on('$routeChangeStart', function(scope, next, current) {
    $rootScope.scrollTop();

    // Формирование массива params
    $rootScope.params = (next) ? next.params : current.params;

    $rootScope.findRoute();
  });
  
  // Init
  $rootScope.api = api('ws://localhost:3001');
  $rootScope.config = config;
  $rootScope.findRoute();
});


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



    app.filter('formatedParams', function() {
      return function(o) {
        var object = angular.copy(o);
        for(var key in object) {
          if (object[key] = "number") object[key] = '';
        }
        return JSON.stringify(object, null, 4);
    }});

    app.filter('JSON', function() {
      return function(o) {
        return JSON.stringify(o, null, 4);
    }});


//  Angular роутинг --------------------------------------------------------------
app.config(function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
  $locationProvider.html5Mode(true);

  var route;
  
  for (var url in config.routes) {
    route = config.routes[url];

    var filename = ((url == '/') ? 'index' : url.substr(1)) + '.html';

    // страница
    var page = { templateUrl: route.template || filename };

    // controller страницы
    if (route.controller) page.controller = route.controller;

    $routeProvider.when(url, page);
  }
});

    // Safe Apply
    angular.module('app').run(['$rootScope', function($rootScope) {
            $rootScope.safeApply = function(fn) {
                var phase = this.$root.$$phase;
                if(phase == '$apply' || phase == '$digest') {
                    if(fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };
    }]);


app.directive("autoGrow", ['$window', function($window){
    return {
        link: function (scope, element, attr, $window) {
            var update = function () {
                var scrollLeft, scrollTop;
                scrollTop = window.pageYOffset;
                scrollLeft = window.pageXOffset;

                element.css("height", "auto");
                var height = (element[0].scrollHeight) + 6;
                if (height > 0) {
                    element.css("height", height + "px");
                }
                window.scrollTo(scrollLeft, scrollTop);
            };
            scope.$watch(attr.ngModel, function () {
                update();
            });
            attr.$set("ngTrim", "false");
        }
    };
}]);

app.controller("aggCtrl", function($scope) {
  
  // Initial values
  var model = {
    sn: '',
    description: ''
  };

  var lic = {
    id: null,
    ports: null,
    mirror: false,
    mpls: false
  };
  
  $scope.get = function(cbk) {
    $scope.api('agg.get', function(err, result) {
      $scope.agg = result;
      if (typeof cbk == 'function') cbk(result);
    });
  }

  $scope.remove = function(id) {
    if (confirm('Вы действительно хотите удалить устройство?')) {
      $scope.api('agg.remove', {id: id}, function(err, result) {
        $scope.get();
      });
    }
  }

  $scope.add = function(id) {
    $scope.model.sn = $scope.model.sn.toUpperCase();
    $scope.api('agg.add', $scope.model, function(err, result) {
      $scope.get();
      $scope.model = angular.copy(model);
      $scope.show.form = false;
    });
  };

  $scope.licenseAdd = function(id) {
    $scope.lic.id = id;
    
    $scope.api('agg.licenseadd', $scope.lic, function(err, result) {
      $scope.get(function() {
        // Select Agg after get 
        $scope.agg.forEach(function(i) {
          if (i.id == id) i.selected = true;
        });
      });

      $scope.lic = angular.copy(lic);
      $scope.show.license = false;
    });
  };
  
  $scope.selectAgg = function(a) {
    $scope.agg.forEach(function(i) {
      if (a == i) i.selected = true; else i.selected = false;
    });
  };
  
  // Init
  $scope.model = angular.copy(model);
  $scope.lic = angular.copy(lic);

  $scope.show = {};
  
  $scope.get();
  
});



  app.controller("devCtrl", function($scope, $filter, $http, $timeout, $localStorage, api) {
            
      $scope.initMethod = function(model, method, vmethod) {
        vmethod.methodname = model + '.' + method;
        if (vmethod.params) {
          vmethod.formatedParams = $filter('formatedParams')(vmethod.params);
        } else {
          vmethod.formatedParams = null;
        }
      };

      
      $scope.apicall = function(method, params, vmethod, cbk) {
        
        vmethod._inprogress = true;
        
        try {
          var p = (params) ? JSON.parse(params) : null;
          var start = new Date();
          vmethod.error = false;

          $scope.api(method, p, function(err, result) {

              var elapsed = new Date() - start;
              vmethod._elapsed = elapsed;
              vmethod._inprogress = false;
              
              vmethod._result = (err && typeof result === 'object') ? JSON.stringify(result, null, 4) : result;
              vmethod._error = (err && typeof err === 'object') ? JSON.stringify(err, null, 4) : err;
              
              if (typeof cbk == 'function') cbk(err, result);
            
          });
        } catch(e) {
          vmethod._jsonerror = true;
          vmethod._shake = true;

          
          console.error('JSON parse error', e);
        }
      };
      
      $scope.testAll = function() {
        var vmethod, vmodel;
        $scope._testAll = false;
        $scope.forms = true;
        $scope.expand = true;        
        $scope._allErrors = 0;
        for(var model in $scope.config.api) {
          vmodel = $scope.config.api[model];
          for(var method in vmodel.methods) {
            vmethod = vmodel.methods[method];
              $scope.initMethod(model,method,vmethod);
              $scope.apicall(vmethod.methodname,vmethod.formatedParams,vmethod, function(err, result) {
                 if (err) $scope._allErrors++;
              });
          }
        }
        
        $timeout(function() {
          $scope._testAll = true;
        }, 300);
        
      };

      $scope.login = function() {
        
        $scope._loginerror = false;
        
        $scope.api('users.login', {'name': $scope.name, 'password': $scope.password}, function(err, res) {
            if (err) {
              $scope._loginerror = true;
            } else {
              $scope.autorized = true;
              $localStorage.me = res;
              $scope.me = res;
            }
        });
      };       
      
      $scope.logout = function() {
        $scope.api('users.logout', {'token': $localStorage.me.token}, function(err, res) {
            $scope.autorized = false;
            $localStorage.me = null;
            $scope.me = null;
        });
      }; 
      
      // Init
      $scope.autorized = false;
      $scope.forms = true;
      $scope.expand = true;

      if ($localStorage.me) {
          $scope.autorized = true;
          $scope.me = $localStorage.me;        
      }
      
    });



app.controller("loginCtrl", function($scope, $localStorage, $location, $route) {

  // Initial model
  var model = {
    name: '',
    password: '',
    show: false,
    error: false
  };
  
  $scope.login = function() {
    
    $scope.model.error = false;
    
    $scope.api('users.login', {'name':$scope.model.name, 'password':$scope.model.password}, function(err, res) {
        if (err) {
          $scope.model.error = true;
        } else {
          $scope.model = angular.copy(model);
          $localStorage.me = res;
          $route.reload();
        }
    });
  };       
  
  $scope.register = function() {
    $scope.model.errorregister = false;
    $scope.api('users.register', {'name':$scope.model.name, 'password':$scope.model.password}, function(err, res) {
        if (err) {
          $scope.model.error = true;
          $scope.model.errorregister = true;
        } else {
          $scope.model.message = 'Дождитесь пока Администратор подтвердит вашу регистрацию.';
        }
    });
  };       

  $scope.logout = function() {
    $scope.api('users.logout', {'token': $localStorage.me.token}, function(err, res) {
      $localStorage.me = null;
      $location.path('/');
      $route.reload();
    });
  };   
  
  // Init
  $scope.model = angular.copy(model);
});


app.controller("softwareCtrl", function($scope) {

  // Init
  $scope.api('software.list', function(err, result) {
    $scope.software = result;
  });

});


app.controller("usersCtrl", function($scope) {
  
  $scope.get = function(cbk) {
    $scope.api('users.get', function(err, result) {
      if (err) {
        
      } else {
        $scope.usersNEW = result.filter(function(i) {return i.state == 'NEW'; });
        $scope.usersBAN = result.filter(function(i) {return i.state == 'BAN'; });
        $scope.users = result.filter(function(i) {return i.state == 'ACTIVE'; });
        
        if (typeof cbk == 'function') cbk(result);
      }
    });
  };

  $scope.remove = function(id) {
    if (confirm('Вы действительно хотите удалить пользователя?')) {
      $scope.api('users.remove', {id: id}, function(err, result) {
        $scope.get();
      });
    }
  };

  $scope.update = function(item) {
    $scope.api('users.update', item, function(err, result) {
        $scope.get();
    });
  };
  
  $scope.aprove = function(u) {
    u.state = 'ACTIVE';
    u.role = 'user';
    $scope.api('users.update', u, function(err, result) {
      $scope.get();
    });
  };

  $scope.ban = function(id) {
    $scope.api('users.switchState', {id: id, state: 'BAN'}, function(err, result) {
      $scope.get();
    });
  };
  
  $scope.select = function(item) {
    $scope.users.forEach(function(i) {
      if (item == i) i.selected = true; else i.selected = false;
    });
  };
  
  // Init
  $scope.get();
  
});


//# sourceMappingURL=all.js.map