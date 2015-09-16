
    var app = angular.module("app",[]);

    app.controller("appCtrl", function($scope, $filter, $http, $timeout, api) {
      
      $scope.apiSchema = apiSchema;
      $scope.api = api('ws://localhost:3001');
      $scope.autorized = false;
      $scope.forms = true;
      $scope.expand = true;
      
      $scope.initMethod = function(model, method, vmethod) {
        vmethod.methodname = model + '.' + method;
        if (vmethod.params) {
          vmethod.formatedParams = $filter('formatedParams')(vmethod.params);
        } else {
          vmethod.formatedParams = null;
        }
      };

      
      $scope.apicall = function(method, params, vmethod) {
        
        vmethod._inprogress = true;
        
        try {
          var p = (params) ? JSON.parse(params) : null;
          var start = new Date();
          vmethod.error = false;
          $scope.api(method, p, function(err, result) {
            $scope.$apply(function() {
              var elapsed = new Date() - start;
              vmethod._elapsed = elapsed;
              vmethod._inprogress = false;
              
              vmethod._result = (err && typeof result === 'object') ? JSON.stringify(result, null, 4) : result;
              vmethod._error = (err && typeof err === 'object') ? JSON.stringify(err, null, 4) : err;
            });
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
      
      $scope.login = function() {
        console.log(22);
        $scope.api('users.login', [$scope.username, $scope.password], function(res) {
          console.log('LOGIN', res);
        });
      };      
      
      $scope.api('mirror', ['a param', 'another param']);
      
    });


    
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