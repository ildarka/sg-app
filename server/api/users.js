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
    //Put your code here
    sgapp.send("Ok");
  }
};

var register = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  // Custom register method FIXME: change to sql call with chacker + jsonShema validation
  /*
  if (sgapp.params.username == '' || sgapp.params.password == '') {
    sgapp.error('InvalidParams');
  };
  */
  
  if (!sgapp.errors) {
    var params = {
      username: sgapp.params.username,
      password: sgapp.params.password,
      state: 'NEW',
      date: new Date()
    };
    console.log(1);
    sgapp.db.saveDoc('users', params, function(err, res) {
      console.log(2);
      sgapp.send('Registered');
    });
  }
};


module.exports.get = get;
module.exports.update = update;
module.exports.changePassword = changePassword;
module.exports.remove = remove;
module.exports.switchState = switchState;
module.exports.register = register;
