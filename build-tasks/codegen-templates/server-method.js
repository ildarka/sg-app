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
  {{else if is.register}}
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
    sgapp.db.saveDoc('{{module}}', params, function(err, res) {
      console.log(2);
      sgapp.send('Registered');
    });
  }
  {{#if is.login}}
  if (!sgapp.errors) {
      sgapp.db.users.login([sgapp.params.username, sgapp.params.password],function(err, res) {
        sgapp.send(res);
      });
    }
  }
  {{else}}
  if (!sgapp.errors) {
    //Put your code here
    sgapp.send("Ok");
  }
{{/if}}
};
