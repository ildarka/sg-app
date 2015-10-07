
app.controller("generatorCtrl", function($scope, Upload) {
  
  // Initial models
  var model = {
    name: null,
    ratetype: 'bitrate',
    rate: 10,
    output: 1,
    files: []
  };
  
  var outputs = [
    {id: 1, label: 1},
    {id: 2, label: 2},
    {id: 3, label: 3},
    {id: 4, label: 4}
  ];
  
  // Toggle «loop» and «swarm» parameters 
  $scope.toggle= function(model, what) {
    model[what] = !model[what];
    $scope.update(model);
  };
  
  // Get PCAP-files from server
  $scope.getFiles = function() {
    $scope.api('generator.getFiles', function(err, result) {
      $scope.files = result;
    });
  };

  // Get scenarios
  $scope.get = function(cbk) {
    $scope.api('generator.get', function(err, result) {
      if (typeof cbk == 'function') cbk(result);
      $scope.generators = result;
    });
  };

  // Remove scenario
  $scope.remove = function(id) {
    if (confirm('Вы действительно хотите удалить сценарий?')) {
      $scope.api('generator.remove', {id: id}, function(err, result) {
        $scope.get();
      });
    }
  };

  // Add scenario
  $scope.add = function(id) {
    $scope.api('generator.add', $scope.model, function(err, result) {
      $scope.get();
      $scope.model = angular.copy(model);
      $scope.show.form = false;
    });
  };  
  
  // Select active scenario
  $scope.selectGen = function(a) {
    $scope.update(a);
    $scope.generators.forEach(function(i) {
      if (a == i) i.selected = true; else i.selected = false;
    });
    $scope.currentGen = angular.copy(a);
  };
  
  // Update scenario on server
  $scope.update = function(model) {
    if ($scope.currentGen && !angular.equals(model, $scope.currentGen) && $scope.currentGen.id == model.id) {
      var m = angular.copy(model);
      m.selected = false;
      $scope.api('generator.update', m, function(err, result) {
        $scope.get(function(result) {
          result.forEach(function(i) {
            if (i.id == model.id) {
              i.selected = true;
            }
          });
        });
      });      
    }
  };

  $scope.dragStart = function(data, ev) {
    var el = angular.element(ev.element[0]);
    el.addClass('-absolute');
  };
  
  // Add file to scenario by DnD
  $scope.addScenarioFile = function(file, ev, s) {
    $scope.selectGen(s);
    //console.log('---', file, ev, s);
    var el = angular.element(ev.element[0]);
    el.removeClass('-absolute');
    if (!s.files) s.files = [];
    if (s.files.every(function(i) {return i != file})) {
      s.files.push(file);
    }
    $scope.update(s);
  };
  
  // Remove file from scenario
  $scope.removeScenarioFile = function(model, index) {
    model.files.splice(index, 1);
    $scope.update(model);
  };
  
  // uploadFiles to server
  $scope.uploadFiles = function (files) {
    if (files && files.length) {
      Upload.upload({url: 'uploadFiles/', data: {file: files}}).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            $scope.getFiles();
            $scope.progress = 0;
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progress = progressPercentage;
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    }
  };

  // Init --------------
  $scope.getFiles();
  $scope.get();
  
  $scope.model = angular.copy(model);
  $scope.outputs = angular.copy(outputs);
  $scope.progress = 0;

  
});
