app.controller("generatorCtrl", function($scope) {
  var model = {
    name: null,
    ratetype: 'bitrate',
    rate: 10,
    output: 1
  };
  
  var outputs = [
    {id: 1, label: 1},
    {id: 2, label: 2},
    {id: 3, label: 3},
    {id: 4, label: 4}
  ];
  
  $scope.getFiles = function() {
    $scope.api('generator.getfiles', function(err, result) {
      $scope.files = result;
    });
  };

  $scope.get = function(cbk) {
    $scope.api('generator.get', function(err, result) {
      $scope.generators = result;
      if (typeof cbk == 'function') cbk(result);
    });
  }

  $scope.remove = function(id) {
    if (confirm('Вы действительно хотите удалить сценарий?')) {
      $scope.api('generator.remove', {id: id}, function(err, result) {
        $scope.get();
      });
    }
  }
  
  $scope.toggle= function(m, what) {
    m[what] = !m[what];
    $scope.update(m);
  };

  $scope.selectGen= function(a) {
    $scope.generators.forEach(function(i) {
      if (a == i) i.selected = true; else i.selected = false;
    });
  };
  
  $scope.add = function(id) {
    $scope.api('generator.add', $scope.model, function(err, result) {
      $scope.get();
      $scope.model = angular.copy(model);
      $scope.show.form = false;
    });
  };

  $scope.update = function(model) {
    var m = angular.copy(model);
    m.selected = false;
    $scope.api('generator.update', m, function(err, result) {
      $scope.get();
    });
  };
  
  
  // Init
  $scope.getFiles();
  $scope.get();
  
  $scope.model = angular.copy(model);
  $scope.outputs = angular.copy(outputs);
  

  
});
