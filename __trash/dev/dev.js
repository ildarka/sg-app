
    var app = angular.module("app",['ngStorage']);

    app.controller("appCtrl", function($scope, $filter, $http, $timeout, $localStorage, api) {
            
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
          $timeout(function() {
            vmethod._shake = false;
          }, 300);
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
        $scope.api('users.login', {'name': $scope.name, 'password': $scope.password}, function(err, res) {
            if (err) {
              $scope._loginerror = true;
              $timeout(function() {
                $scope._loginerror = false;
              }, 300);
              
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

      $scope.config = config;
      $scope.api = api('ws://localhost:3001');

      if ($localStorage.me) {
          $scope.autorized = true;
          $scope.me = $localStorage.me;        
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

    
    // filters $ directives


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