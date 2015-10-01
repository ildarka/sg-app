var {{method}} = function(sgapp) {
  
  sgapp.validate();
  sgapp.ACL();
  
  {{#if is.get}}
  // Get data from Postgres
  
  if (!sgapp.errors) {
    if (!sgapp.db['{{module}}']) {
        sgapp.send([]);
    } else {
      sgapp.db['{{module}}'].findDoc("*", {order: "created_at desc"}, function(err, res) {
        res = res || [];
        sgapp.send(res);
      });
    }
  }
  {{else if is.add}}
  // Add object to Postgres
  var params = sgapp.params;
   
  if (sgapp.schema.params.date && !params.date) {
    params.date = new Date();
  }
   
  sgapp.db.saveDoc('{{module}}', params, function(err, res) {
    sgapp.send('ADD OK!');
  });
  {{else if is.update}}
  // Update object in Postgres
  var params = sgapp.params;

  sgapp.db.saveDoc('{{module}}', params, function(err, res){
    sgapp.send('Update OK!');
  });
  {{else if is.remove}}
  // Manual remove object in Postgres
  if (sgapp.params.id) {
    sgapp.db.run("delete from {{module}} where id=$1", [+sgapp.params.id], function(err, res) {
        sgapp.send('Removed!');
      });
  } else {
        sgapp.error('INVALID_PARAMS');
  }
  {{else if is.login}}
  if (!sgapp.errors) {
    sgapp.db.users.login([sgapp.params.name, sgapp.params.password], function(err, res) {
      if (err) {
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
        body.time = new Date();
        sgapp.onlineusers[token] = body;
        sgapp.send(body);        
      }
    });
  }
  {{else if is.logout}}
  if (!sgapp.errors) {
    delete(sgapp.onlineusers[sgapp.params.token]);
    sgapp.send('OK');
  }
  {{else if is.register}}
  if (!sgapp.errors) {
    sgapp.db.users.register([sgapp.params.name, sgapp.params.password],function(err, res) {
      if (err) sgapp.error(err); else sgapp.send("OK");
    });
  }
  {{else if is.switchState}}
  if (!sgapp.errors) {
    
    var q = 'UPDATE users SET body = body || \'{"state": "' + sgapp.params.state + '"}\' WHERE id = ' + sgapp.params.id;
    console.log(q, sgapp.params);
    sgapp.db.run(q, function(err, res) {
      if (err) sgapp.error(err); else sgapp.send(res);
    });
  }
  {{else if is.list}}
  if (!sgapp.errors) {
    var fs = require('fs');
    var path = sgapp.dirname + '/software/';
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
                r.push({file: f, date: result.mtime});
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
  {{else if is.licenseadd}}
  if (!sgapp.errors) {
    var exec = require('child_process').exec;
    
    sgapp.db['{{module}}'].findDoc({id: sgapp.params.id}, function(err, res) {
      if (err) {
         console.log('err', err);
         sgapp.error('SERVER_ERROR');
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
            sgapp.db['{{module}}'].saveDoc(res, function(err, r) {
              console.log('res', res);
              sgapp.send('OK');
            });
          }
        });
      }
    });
  }
  {{else}}
  if (!sgapp.errors) {
    //Put your code here
    sgapp.send("Ok");
  }
{{/if}}
};
