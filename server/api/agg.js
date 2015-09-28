'use strict';

var get = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  // Get data from Postgres
  
  if (!sgapp.errors) {
    if (!sgapp.db['agg']) {
        sgapp.send([]);
    } else {
      sgapp.db['agg'].findDoc("*", {order: "created_at desc"}, function(err, res) {
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
   
  sgapp.db.saveDoc('agg', params, function(err, res) {
    sgapp.send('ADD OK!');
  });
};

var update = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  // Update object in Postgres
  var params = sgapp.params;

  sgapp.db.saveDoc('agg', params, function(err, res){
    sgapp.send('Update OK!');
  });
};

var remove = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
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
  sgapp.ACL();
  
  if (!sgapp.errors) {
    var exec = require('child_process').exec;
    
    sgapp.db['agg'].findDoc({id: sgapp.params.id}, function(err, res) {
      if (err) {
         console.log('err', err);
         sgapp.error('Problems');
      } else {

        var fname = res.sn + '_' + sgapp.params.ports;
        if (sgapp.params.mirror) fname += '_MR';
        if (sgapp.params.mpls) fname += '_MS';
        fname += '.lic';

        var lic = {file: fname, date: new Date()};        

        exec('node server/scripts/generatelic.js --sn ' + res.sn + ' --ports ' + sgapp.params.ports + ' --mirror '+sgapp.params.mirror + ' --mpls '+sgapp.params.ports + ' --filename ' + fname, function(err, stdout, stderr) {
          if (err) {
            console.log(err);
          } else {
            res.license = res.license || [];
            res.license.push(lic);
            sgapp.db['agg'].saveDoc(res, function(err, r) {
              console.log('res', res);
              sgapp.send('OK');
            });
          }
        });
      }
    });
  }
};


module.exports.get = get;
module.exports.add = add;
module.exports.update = update;
module.exports.remove = remove;
module.exports.licenseadd = licenseadd;
