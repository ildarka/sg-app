'use strict';

var get = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  // Get data from Postgres
  
  if (!sgapp.errors) {
    if (!sgapp.db['agg']) {
        sgapp.send([]);
    } else {
      sgapp.db['agg'].findDoc("*",function(err, res) {
        res = res || [];
        sgapp.send(res);
      });
    }
  }
};

var add = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  // Add object to Postgres
  var params = sgapp.params;
   
  if (sgapp.schema.params.date && !params.date) {
    params.date = new Date();
  }
   
  sgapp.db.saveDoc('agg', params, function(err, res) {
    sgapp.send('ADD OK!');
  });
};

var update = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  // Update object in Postgres
  var params = sgapp.params;

  sgapp.db.saveDoc('agg', params, function(err, res){
    sgapp.send('Update OK!');
  });
};

var remove = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  // Manual remove object in Postgres
  if (sgapp.params.id) {
    sgapp.db.run("delete from agg where id=$1", [+sgapp.params.id], function(err, res) {
        sgapp.send('Removed!');
      });
  } else {
        sgapp.error('Invalid params!');
  }
};

var licenseadd = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  if (!sgapp.errors) {
    //Put your code here
    sgapp.send("Ok");
  }
};

var licenseremove = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  if (!sgapp.errors) {
    //Put your code here
    sgapp.send("Ok");
  }
};


module.exports.get = get;
module.exports.add = add;
module.exports.update = update;
module.exports.remove = remove;
module.exports.licenseadd = licenseadd;
module.exports.licenseremove = licenseremove;
