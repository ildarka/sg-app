
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
