'use strict';

var get = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  // Get data from Postgres
  
  if (!sgapp.errors) {
    if (!sgapp.db['generator']) {
        sgapp.send([]);
    } else {
      sgapp.db['generator'].findDoc("*", {order: "created_at desc"}, function(err, res) {
        res = res || [];
        sgapp.send(res);
      });
    }
  }
};

var add = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  // Add object to Postgres
  var params = sgapp.params;
   
  if (sgapp.schema.params.date && !params.date) {
    params.date = new Date();
  }
   
  sgapp.db.saveDoc('generator', params, function(err, res) {
    sgapp.send('ADD OK!');
  });
};

var update = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  // Update object in Postgres
  var params = sgapp.params;

  sgapp.db.saveDoc('generator', params, function(err, res){
    sgapp.send('Update OK!');
  });
};

var remove = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  // Manual remove object in Postgres
  if (sgapp.params.id) {
    sgapp.db.run("delete from generator where id=$1", [+sgapp.params.id], function(err, res) {
        sgapp.send('Removed!');
      });
  } else {
        sgapp.error('INVALID_PARAMS');
  }
};

var getfiles = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  if (!sgapp.errors) {
    //Put your code here
    sgapp.send("Ok");
  }
};

var removefile = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  if (!sgapp.errors) {
    //Put your code here
    sgapp.send("Ok");
  }
};

var uploadfile = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  if (!sgapp.errors) {
    //Put your code here
    sgapp.send("Ok");
  }
};


module.exports.get = get;
module.exports.add = add;
module.exports.update = update;
module.exports.remove = remove;
module.exports.getfiles = getfiles;
module.exports.removefile = removefile;
module.exports.uploadfile = uploadfile;
