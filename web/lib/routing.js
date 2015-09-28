//  Angular роутинг --------------------------------------------------------------
app.config(function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
  $locationProvider.html5Mode(true);

  var route;
  
  for (var url in config.routes) {
    route = config.routes[url];

    var filename = ((url == '/') ? 'index' : url.substr(1)) + '.html';

    // страница
    var page = { templateUrl: route.template || filename };

    // controller страницы
    if (route.controller) page.controller = route.controller;

    $routeProvider.when(url, page);
  }
});