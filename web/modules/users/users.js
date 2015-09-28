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
