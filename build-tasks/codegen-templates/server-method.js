var {{method}} = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  {{#if is.get}}
  // Get data from Postgres
  
  if (!sgapp.errors) {
    if (!sgapp.db['{{module}}']) {
        sgapp.send([]);
    } else {
      sgapp.db['{{module}}'].findDoc("*",function(err, res) {
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
        sgapp.error('Invalid params!');
  }
  {{else if is.login}}
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
  {{else if is.logout}}
  if (!sgapp.errors) {
    sgapp.onlineusers[sgapp.params.token] = null;
    sgapp.send('OK');
  }
  {{else if is.register}}
  if (!sgapp.errors) {
    sgapp.db.users.register([sgapp.params.name, sgapp.params.password],function(err, res) {
      if (err) sgapp.error(err); else sgapp.send(res);
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
  {{else}}
  if (!sgapp.errors) {
    //Put your code here
    sgapp.send("Ok");
  }
{{/if}}
};
