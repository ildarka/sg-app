(function(module) {
try {
  module = angular.module('templates');
} catch (e) {
  module = angular.module('templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('index.html',
    '<html ng-app="app">\n' +
    '<head>\n' +
    '  <meta charset="utf-8" />\n' +
    '  <base href="/" />  \n' +
    '  <link rel="stylesheet" href="lib/sega2/sega2.css" />\n' +
    '  <link rel="stylesheet" href="all.css" />\n' +
    '</head>\n' +
    '  \n' +
    '<body ng-controller="appCtrl">\n' +
    '  <header>\n' +
    '    \n' +
    '    <div class="me -pull-right" ng-include="\'modules/login/login.html\'"></div>\n' +
    '\n' +
    '    <i class="mdi mdi-beaker" style="font-size:24px; position:absolute; top:7px; left:7px;"></i>\n' +
    '    \n' +
    '    <ul class="menu">\n' +
    '      <li ng-repeat="(url, r) in config.routes" ng-class="{active: r == route}" ng-hide="r.hidden || !ACL(r.access)"><a href="{{url}}">{{r.title}}</a></li>\n' +
    '      <li>&nbsp;</li>\n' +
    '    </ul>\n' +
    '    \n' +
    '  </header>\n' +
    '\n' +
    '  <div ng-include="\'components/messageBox/messageBox.html\'"></div>\n' +
    '  \n' +
    '  <main class="paper {{route.class}}">\n' +
    '    \n' +
    '    <article ng-view="" class="view"></article>\n' +
    '    \n' +
    '  </main>\n' +
    '</body>\n' +
    '  \n' +
    '<script src="lib/angularjs/angular.js"></script>\n' +
    '<script src="lib/ngstorage/ngStorage.min.js"></script>\n' +
    '<script src="lib/angular-route/angular-route.min.js"></script>\n' +
    '<script src="lib/angular-animate/angular-animate.min.js"></script>\n' +
    '<script src="lib/ng-file-upload/ng-file-upload.min.js"></script>\n' +
    '<script src="lib/ngDraggable/ngDraggable.js"></script>\n' +
    '  \n' +
    '<script src="config.js">;</script>\n' +
    '<script src="templates.js">;</script>\n' +
    '<script src="all.js">;</script>\n' +
    '\n' +
    '</html>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('templates');
} catch (e) {
  module = angular.module('templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/messageBox/messageBox.html',
    '<div class="messageBox" ng-class="{error: messageBoxError}" ng-show="messageBox">\n' +
    '  <!--i class="close mdi mdi-close"></i-->\n' +
    '  {{messageBox}}\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('templates');
} catch (e) {
  module = angular.module('templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('modules/agg/agg.html',
    '<hgroup>\n' +
    '  <h1>\n' +
    '    {{route.title}}\n' +
    '  </h1>\n' +
    '  \n' +
    '  <button ng-show="ACL(\'superadmin aggregator.admin\')" ng-click="show.form = !show.form" class="-round -yellow addButton"><i class="mdi mdi-plus"></i></button>\n' +
    '</hgroup>\n' +
    '\n' +
    '<div class="agg">\n' +
    '  <div class="form addform clearfix" ng-show="show.form">\n' +
    '    <form name="addform" ng-submit="add()">\n' +
    '      <input type="text" autofocus class="serial" ng-model="model.sn" placeholder="Серийный номер чипа" required />\n' +
    '\n' +
    '      <div class="description">\n' +
    '        <textarea ng-model="model.description" placeholder="Описание устройства"></textarea> \n' +
    '      </div>\n' +
    '\n' +
    '      <input type="submit" ng-class="{\'-disabled\': !addform.$valid}" value="Сохранить" />  \n' +
    '    </form>  \n' +
    '  </div>\n' +
    '    \n' +
    '  <article ng-repeat="a in agg | orderBy : \'-date\'" class="paper" ng-class="{\'-selected\' : a.selected}" ng-click="selectAgg(a)">\n' +
    '    <div class="actions -pull-right">\n' +
    '      <a ng-show="a.selected" class="pseudo-link -m-right" ng-click="remove(a.id)"><i class="mdi mdi-delete"></i> Удалить устройство</a></li>\n' +
    '      <span class="date">{{a.date|date: \'dd.MM.yyyy\'}}</span>\n' +
    '    </div>\n' +
    '    <h2>SN: {{a.sn}}</h2>\n' +
    '    <div class="description" ng-show="a.description">\n' +
    '      {{a.description}}\n' +
    '    </div>\n' +
    '    \n' +
    '    <div class="license" ng-show="a.selected && a.license">\n' +
    '      <ul>\n' +
    '        <li ng-repeat="l in a.license">\n' +
    '          <a href="/license/{{l.file}}" target="_blank">\n' +
    '            <i class="mdi mdi-star"></i> {{l.file}}\n' +
    '          </a>\n' +
    '        </li>\n' +
    '      </ul>\n' +
    '    </div>\n' +
    '    \n' +
    '    <div class="licenseform" ng-class="{\'licenseform-active\': show.license}" ng-if="a.selected">\n' +
    '\n' +
    '          <a class="pseudo-link" ng-click="show.license = !show.license"><i class="mdi mdi-star-circle"></i> Выпустить лицензию</a>\n' +
    '\n' +
    '          <form name="licform" class="form" ng-show="show.license" ng-submit="licenseAdd(a.id)">\n' +
    '            <div class="field">\n' +
    '              <label class="ports">Порты</label> <input type="text" ng-model="lic.ports" placeholder="от 1 до 64" size="7" required />\n' +
    '            </div>\n' +
    '            <div class="field ports-shift">\n' +
    '              <label><input type="checkbox" ng-model="lic.mirror" /> Mirror</label>\n' +
    '            </div>\n' +
    '            <div class="field ports-shift">\n' +
    '              <label><input type="checkbox" ng-model="lic.mpls" /> MPLS</label>\n' +
    '            </div>\n' +
    '            <div class="ports-shift">            \n' +
    '              <input type="submit" value="ОК" ng-class="{\'-disabled\': !licform.$valid}" />\n' +
    '            </div>\n' +
    '          </form>\n' +
    '      \n' +
    '    </div>\n' +
    '    \n' +
    '  </article>\n' +
    '\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('templates');
} catch (e) {
  module = angular.module('templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('modules/dev/dev.html',
    '  <div class="dev">\n' +
    '    <article ng-show="!autorized" class="-m-bottom">\n' +
    '\n' +
    '      <form class="form" name="userform" ng-submit="login()" ng-class="{shake: _loginerror}">\n' +
    '        <div class="field">\n' +
    '          <label>Пользователь</label>\n' +
    '          <input ng-model="name" required type="text" />\n' +
    '        </div>  \n' +
    '        <div class="field">\n' +
    '          <label>Пароль</label>\n' +
    '          <input ng-model="password" required type="password" />\n' +
    '        </div>\n' +
    '        <input type="submit" value="Войти" class="-m-right" ng-class="{\'-disabled\':!userform.$valid}" /> \n' +
    '      </form>\n' +
    '\n' +
    '    </article>\n' +
    '\n' +
    '    <p ng-show = "autorized">\n' +
    '      <span style="margin-right:20px">Log On as {{me.name}}. Token: {{me.token}}</span> <a ng-click="logout()">logout</a>\n' +
    '    </p>\n' +
    '    \n' +
    '    <div style="margin-left:-10px">\n' +
    '      <span class="tap" ng-class="{\'-active\': expand}"><a ng-click="expand=!expand">Expand all</a></span> \n' +
    '      <span class="tap" ng-class="{\'-active\': forms}"><a ng-click="forms=!forms">Show forms</a></span> \n' +
    '      <span style="margin-right:20px" class="tap" ng-class="{\'-active\': params}"><a ng-click="params=!params">Show params</a></span>\n' +
    '      <button style="margin-right:20px" class="-rounded" ng-click="testAll()">Test all API</button>\n' +
    '      <span class="allErrors" ng-show="_allErrors">Errors: {{_allErrors}}</span>\n' +
    '      <span ng-show="_testAll && !_allErrors">All OK!</span>\n' +
    '    </div>\n' +
    '    \n' +
    '    <article class="clearfix" ng-repeat="(model, vmodel) in config.api">\n' +
    '      <h1>{{model | uppercase}}</h1>\n' +
    '          <div class="method clearfix" ng-repeat="(method, vmethod) in vmodel.methods" ng-init="initMethod(model,method,vmethod)">\n' +
    '            <div>\n' +
    '              <a class="pseudo-link" ng-click="vmethod.expand = !vmethod.expand">{{vmethod.methodname}}</a>\n' +
    '            </div>\n' +
    '            \n' +
    '            <div class="more" ng-show="expand || vmethod.expand">\n' +
    '            <div class="form" ng-show="forms">\n' +
    '              <textarea ng-if="vmethod.params" style="height:6em" ng-model="vmethod.formatedParams" auto-grow ng-class="{jsonerror: vmethod._jsonerror, shake: vmethod._shake}"></textarea>\n' +
    '              <div>\n' +
    '                <input type="submit" class="-small -blue" value="Отправить" ng-click="apicall(vmethod.methodname,vmethod.formatedParams,vmethod)" /> \n' +
    '\n' +
    '                <span class="elapsed">\n' +
    '                  <span ng-if="!vmethod._inprogress && vmethod._elapsed"><span ng-bind="vmethod._elapsed"></span> ms</span>\n' +
    '                  <span ng-if="vmethod._inprogress"><i class="fa fa-spin fa-circle-o-notch"></i></span>\n' +
    '                </span>\n' +
    '              </div>\n' +
    '              <div ng-if="vmethod._result && !vmethod._error" class="result">\n' +
    '                <pre class="json">{{vmethod._result}}</pre>\n' +
    '              </div>  \n' +
    '              <div ng-if="vmethod._error" class="error">\n' +
    '                <pre class="json">Error: {{vmethod._error}}</pre>\n' +
    '              </div>  \n' +
    '            </div>\n' +
    '              \n' +
    '\n' +
    '            <div class="params" ng-show="params">\n' +
    '              <pre class="request json" ng-if="vmethod.params">Request:\n' +
    '{{vmethod.params | JSON}}\n' +
    '              </pre>\n' +
    '              <pre class="request json" ng-if="vmethod.response" ng-class="{\'no-top-padding\': vmethod.params}">Response:\n' +
    '{{vmethod.response | JSON}}\n' +
    '              </pre>\n' +
    '\n' +
    '            </div>\n' +
    '                        \n' +
    '          </div>  \n' +
    '    </article>  \n' +
    '\n' +
    '    \n' +
    '  </div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('templates');
} catch (e) {
  module = angular.module('templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('modules/generator/generator.html',
    '<table class="generator"><tr>\n' +
    '  <td class="paper -nopaddings" ngf-drop="uploadFiles($files)" class="drop-box"\n' +
    '  ngf-drag-over-class="dragover" ngf-multiple="true" >\n' +
    '    <div class="scroller">\n' +
    '      <div class="-paddings">\n' +
    '      <div class="toolbar">\n' +
    '        <input type="search" ng-model="filter" placeholder="Фильтр файлов" class="-m2-right" />\n' +
    '        <a ngf-select="uploadFiles($files)" multiple="multiple" class="pseudo-link">Загрузить файл</a>\n' +
    '      </div>\n' +
    '        \n' +
    '      <progress ng-show="progress" class="uploadprogress" min="0" max="100" ng-attr-value="{{progress}}"></progress>\n' +
    '  \n' +
    '      <table class="table files">\n' +
    '        <thead>\n' +
    '          <tr>\n' +
    '            <th class="name">Имя</th>\n' +
    '            <th>Размер</th>\n' +
    '            <th>Дата</th>\n' +
    '            <!--th>Пользователь</th-->\n' +
    '          </tr>\n' +
    '        </thead>\n' +
    '        <tbody>\n' +
    '        <tr ng-repeat="f in files | orderBy : \'-date\' | filter : filter">\n' +
    '          <td><div ng-drag="true" ng-drag-data="f.file">{{f.file}}</div></td>\n' +
    '          <td class="addon size">{{f.size | byteformat}}</td>\n' +
    '          <td class="addon date">{{f.date | date : "dd.MM.yyyy"}}</td>\n' +
    '          <!--td class="-misc">{{f.username}}</td-->\n' +
    '        </tr>        \n' +
    '        </tbody>\n' +
    '      </table>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </td>\n' +
    '  <td class="paper -nopaddings">\n' +
    '    <div class="scroller">\n' +
    '      <hgroup>\n' +
    '        <h1>\n' +
    '           {{route.title}}\n' +
    '        </h1>\n' +
    '\n' +
    '        <button style="position: absolute; top: 30px; left:420px;" ng-click="show.form = !show.form" class="-round -yellow"><i class="mdi mdi-plus"></i></button>\n' +
    '      </hgroup>\n' +
    '\n' +
    '      <div class="form addform clearfix" ng-show="show.form">\n' +
    '        <form ng-submit="add()">\n' +
    '          <input type="text" autofocus ng-model="model.name" placeholder="Название сценария" required class="genname" />\n' +
    '\n' +
    '          <input type="submit" class="hidden" />\n' +
    '        </form>  \n' +
    '      </div>\n' +
    '      <div ng-repeat="s in generators | orderBy : \'-id\' track by $index" class="paper -relative" ng-class="{\'-selected\' : s.selected}" ng-click="selectGen(s)"\n' +
    '      ng-drag-start="dragStart($data, $event)" ng-drop="true" ng-drop-success="addScenarioFile($data,$event,s)"\n' +
    '      >\n' +
    '\n' +
    '      <div class="actions -pull-right">\n' +
    '        <a ng-show="s.selected" class="pseudo-link -m-right" ng-click="remove(s.id)"><i class="mdi mdi-delete"></i> Удалить</a></li>\n' +
    '        <span class="date">{{s.date|date: \'dd.MM.yyyy\'}}</span>\n' +
    '      </div>\n' +
    '      \n' +
    '        <h2>\n' +
    '          <a class="pseudo-link" contenteditable ng-model="s.name" strip-br="true" ng-enter="update(s)"></a>\n' +
    '        </h2>\n' +
    '        \n' +
    '        <div ng-show="s.selected && s.files.length" class="-m-top">\n' +
    '                      \n' +
    '          <span class="-m-right">\n' +
    '            <select ng-model="s.ratetype" ng-change="update(s)">\n' +
    '              <option value="bitrate">Битрейт</option>\n' +
    '              <option value="packetrate">Пакетрейт</option>\n' +
    '            </select>\n' +
    '\n' +
    '            <input type="text" class="rate" ng-model="s.rate" ng-change="update(s)" /> \n' +
    '\n' +
    '            <span ng-show="s.ratetype == \'bitrate\'">Mbit/s</span>\n' +
    '            <span ng-show="s.ratetype == \'packetrate\'">MPPS</span>\n' +
    '          </span>\n' +
    '\n' +
    '          Выход № <select ng-options="o.id as o.label for o in outputs" ng-model="s.output" ng-change="update(s)"></select>\n' +
    '\n' +
    '          <button class="-rounded -green play"><i class="mdi mdi-play"></i> Пуск</button>\n' +
    '    \n' +
    '          <div class="scenario-files -m-top" ng-show="s.files.length">\n' +
    '            <h2>Файлы</h2>\n' +
    '            <div ng-repeat="f in s.files">\n' +
    '              <div class="remove" ng-click="removeScenarioFile(s, $index)"><i class="mdi mdi-delete"></i></div>\n' +
    '              {{f}} \n' +
    '            </div>\n' +
    '          </div>\n' +
    '          \n' +
    '          <div class="-m-top" style="margin-left: -10px" ng-show="s.files.length">\n' +
    '            <span class="tap" ng-class="{\'-active\': s.swarm}"><a ng-click="toggle(s,\'swarm\')">Перемешать</a></span>\n' +
    '            <span class="tap" ng-class="{\'-active\': s.loop}"><a ng-click="toggle(s,\'loop\')">Зациклить</a></span>\n' +
    '          </div>\n' +
    '                    \n' +
    '        </div>\n' +
    '          \n' +
    '        <div class="-m-top -muted" ng-show="s.selected && !s.files.length">\n' +
    '          Добавьте файлы перетаскиванием из левой панели.\n' +
    '        </div>\n' +
    '\n' +
    '          \n' +
    '          \n' +
    '        \n' +
    '      </div>\n' +
    '      \n' +
    '    </div>\n' +
    '  </td>\n' +
    '</tr>\n' +
    '</tbody>\n' +
    '</table>');
}]);
})();

(function(module) {
try {
  module = angular.module('templates');
} catch (e) {
  module = angular.module('templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('modules/login/login.html',
    '<div class="login" ng-controller="loginCtrl">\n' +
    '\n' +
    '  <div class="unautorized" ng-show="!me()">\n' +
    '  <a class="pseudo-link" ng-click="model.show=!model.show">Login</a>\n' +
    '  <form name="userform" ng-show="model.show" class="panel -panel-white form" ng-submit="login()" ng-class="{shake: model.error}">\n' +
    '    <i class="mdi mdi-window-close -pull-right" ng-click="model.show = false"></i>\n' +
    '    <div class="field">\n' +
    '      <label>Пользователь</label>\n' +
    '      <input ng-model="model.name" required type="text" />\n' +
    '    </div>  \n' +
    '    <div class="field">\n' +
    '      <label>Пароль</label>\n' +
    '      <input ng-model="model.password" required type="password" />\n' +
    '    </div>\n' +
    '    <input type="submit" value="Войти" class="-m-right" ng-class="{\'-disabled\':!userform.$valid}" /> \n' +
    '    <a class="pseudo-link" ng-click="register()">Регистрация</a>\n' +
    '    \n' +
    '    <p class="error" ng-show="model.errorregister">Это имя пользователя уже занято!</p>\n' +
    '    <p ng-show="model.message">{{model.message}}</p>\n' +
    '    \n' +
    '  </form>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="autorized" ng-show="me()">\n' +
    '    <a class="pseudo-link" ng-click="model.show=!model.show"><i class="mdi mdi-account"></i> {{me().name}}</a>\n' +
    '    <div class="panel -panel-white form"  ng-show="model.show">\n' +
    '      <i class="mdi mdi-window-close -pull-right" ng-click="model.show = false"></i>\n' +
    '      <a class="pseudo-link" ng-click="logout()">Выход</a>\n' +
    '    </div>\n' +
    '  </div>  \n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('templates');
} catch (e) {
  module = angular.module('templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('modules/software/software.html',
    '<h1>\n' +
    '  {{route.title}}\n' +
    '</h1>\n' +
    '\n' +
    '<div class="software">\n' +
    '<ul>\n' +
    '  <li ng-repeat="s in software">\n' +
    '    <span class="date">{{s.date | date : "dd.MM.yyyy"}}</span> <a href="/software/{{s.file}}" target="_blank">{{s.file}}</a>\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('templates');
} catch (e) {
  module = angular.module('templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('modules/users/users.html',
    '<h1>\n' +
    '  {{route.title}}\n' +
    '</h1>\n' +
    '\n' +
    '<div class="users clearfix columns2">\n' +
    '\n' +
    '<div class="column">\n' +
    '    <ul>\n' +
    '      <li ng-repeat="u in users | orderBy : \'id\' track by $index">\n' +
    '        <div class="-pull-right" ng-if="u.id != me().id">\n' +
    '          <select ng-model="u.role" ng-change="update(u)" ng-options="key as value for (key, value) in config.api.users.roles" class="role -m-right" >\n' +
    '          </select>  \n' +
    '          <a ng-click="ban(u.id)" class="pseudo-link -muted"><i class="mdi mdi-window-close"></i> Бан</a>\n' +
    '        </div>\n' +
    '        <i class="mdi mdi-account"></i>\n' +
    '        <b>{{u.name}}</b>\n' +
    '\n' +
    '      </li>\n' +
    '    </ul>\n' +
    '</div>\n' +
    '\n' +
    '<div class="column panel" ng-show="usersNEW.length || usersBAN.length">\n' +
    '    <div ng-show="usersNEW.length">\n' +
    '      <i>Ждут подтверждения</i>\n' +
    '      <ul>\n' +
    '        <li ng-repeat="u in usersNEW">\n' +
    '          <div class="-pull-right">\n' +
    '            <a ng-click="aprove(u)" class="pseudo-link -m-right"><i class="mdi mdi-check"></i> OK</a>\n' +
    '            <a ng-click="remove(u.id)" class="pseudo-link -muted"><i class="mdi mdi-window-close"></i> Удалить</a>\n' +
    '          </div>\n' +
    '\n' +
    '          <span class="date">{{u.date | date : "dd.MM.yyyy"}}</span> \n' +
    '          <i class="mdi mdi-account"></i>\n' +
    '          <b>{{u.name}}</b>\n' +
    '        </li>\n' +
    '      </ul>\n' +
    '    </div>\n' +
    '    \n' +
    '    <div ng-class="{\'-m2-top\': usersNEW.length}" ng-show="usersBAN.length">\n' +
    '      <i>Забаненные</i>\n' +
    '      <ul>\n' +
    '        <li ng-repeat="u in usersBAN">\n' +
    '          <div class="-pull-right">\n' +
    '            <a ng-click="aprove(u)" class="pseudo-link -m-right"><i class="mdi mdi-check"></i> OK</a>\n' +
    '            <a ng-click="remove(u.id)" class="pseudo-link -muted"><i class="mdi mdi-window-close"></i> Удалить</a>\n' +
    '          </div>\n' +
    '\n' +
    '          <span class="date">{{u.date | date : "dd.MM.yyyy"}}</span> \n' +
    '          <i class="mdi mdi-account"></i>\n' +
    '          <b>{{u.name}}</b>\n' +
    '        </li>\n' +
    '      </ul>\n' +
    '    </div>\n' +
    '  \n' +
    '  \n' +
    '</div>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);
})();
