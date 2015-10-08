'use strict';

var get = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  // Get data from Postgres
  if (!sgapp.db['generator']) {
    sgapp.send([]);
  } else {
    sgapp.db['generator'].findDoc("*", {order: "created_at desc"}, function(err, res) {
      res = res || [];
      sgapp.send(res);
    });
  }
};

var add = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  // Add object to Postgres
  var params = sgapp.params;
   
  // Date hack with now()
  if (sgapp.schema.params.date && !params.date) {
    params.date = new Date();
  }
   
  if (!sgapp.errors) {
    sgapp.db.saveDoc('generator', params, function(err, res) {
      sgapp.send('ADD OK!');
    });
  }
};

var update = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  // Update object in Postgres
  if (!sgapp.errors) {
    sgapp.db.saveDoc('generator', sgapp.params, function(err, res){
      sgapp.send('Update OK!');
    });
  }
};

var remove = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  // Manual remove object in Postgres
  if (!sgapp.errors) {
    sgapp.db.run("delete from generator where id=$1", [+sgapp.params.id], function(err, res) {
      sgapp.send('Removed!');
    });
  }
};

var getFiles = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  if (!sgapp.errors) {
    var fs = require('fs');
    var path = sgapp.dirname + '/pcap/';
    fs.readdir(path, function(err, res) {
      if (err) {
        console.log('is list', err);
      } else {
        var r = [];
        console.log('res', res);
        res.forEach(function(f, index) {
            fs.stat(path + f, function(err, result) {
              if (err) {
                throw(err);
              } else {
                r.push({file: f, date: result.mtime, size: result.size});
                if (r.length == res.length) {
                  console.log('r', r, index, res.length);
                  sgapp.send(r, index);
                }
              }
            });
        });
      }
    }); 
  }
};

var removeFile = function(sgapp) {
  
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
module.exports.getFiles = getFiles;
module.exports.removeFile = removeFile;
