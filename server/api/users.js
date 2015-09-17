'use strict';

var get = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  // Get data from Postgres
  
  if (!sgapp.errors) {
    if (!sgapp.db['users']) {
        sgapp.send([]);
    } else {
      sgapp.db['users'].findDoc("*",function(err, res) {
        res = res || [];
        sgapp.send(res);
      });
    }
  }
};

var login = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  if (!sgapp.errors) {
    sgapp.db.users.login([sgapp.params.username, sgapp.params.password], function(err, res) {
      if (err) {
        console.log(err);
        sgapp.error(err);
      } else {
        var rand = function() {
            return Math.random().toString(36).substr(2);
        };

        var gettoken = function() {
            return rand() + rand(); // to make it longer
        };
     
        var token = gettoken();
        var body = res[0].o_body;
        body.id = res[0].o_id;
        body.token = token;
        sgapp.onlineusers[token] = body;
        sgapp.send(body);
      }
    });
  }
};

var logout = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  if (!sgapp.errors) {
    sgapp.onlineusers[sgapp.params.token] = null;
    sgapp.send('OK');
  }
};

var update = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  // Update object in Postgres
  var params = sgapp.params;

  sgapp.db.saveDoc('users', params, function(err, res){
    sgapp.send('Update OK!');
  });
};

var changePassword = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  if (!sgapp.errors) {
    //Put your code here
    sgapp.send("Ok");
  }
};

var remove = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  // Manual remove object in Postgres
  if (sgapp.params.id) {
    sgapp.db.run("delete from users where id=$1", [+sgapp.params.id], function(err, res) {
        sgapp.send('Removed!');
      });
  } else {
        sgapp.error('Invalid params!');
  }
};

var switchState = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  if (!sgapp.errors) {
    
    var q = 'UPDATE users SET body = body || \'{"state": "' + sgapp.params.state + '"}\' WHERE id = ' + sgapp.params.id;
    console.log(q, sgapp.params);
    sgapp.db.run(q, function(err, res) {
      if (err) sgapp.error(err); else sgapp.send(res);
    });
  }
};

var register = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  if (!sgapp.errors) {
    sgapp.db.users.register([sgapp.params.name, sgapp.params.password],function(err, res) {
      if (err) sgapp.error(err); else sgapp.send(res);
    });
  }
};


module.exports.get = get;
module.exports.login = login;
module.exports.logout = logout;
module.exports.update = update;
module.exports.changePassword = changePassword;
module.exports.remove = remove;
module.exports.switchState = switchState;
module.exports.register = register;
