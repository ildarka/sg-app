app.controller("softwareCtrl", function($scope) {

  // Init
  $scope.api('software.list', function(err, result) {
    $scope.software = result;
  });

});
