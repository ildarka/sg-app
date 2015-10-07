var app = angular.module("app",['ngRoute', 'ngAnimate', 'ngStorage', 'templates', 'ngFileUpload', 'ngDraggable']);

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

  $rootScope.messageError = function(err) {
    if ($rootScope.clearMessage) $timeout.cancel($rootScope.clearMessage);
    $rootScope.messageBox = err.message;
    $rootScope.messageBoxError = true;
    $rootScope.clearMessage = $timeout(function(){
      $rootScope.messageBox = null;
    }, 5000);
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
