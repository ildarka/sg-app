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
