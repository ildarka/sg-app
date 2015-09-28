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
