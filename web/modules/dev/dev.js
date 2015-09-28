
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

