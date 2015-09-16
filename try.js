var massive = require("massive");
var connectionString = "postgres://localhost/try";

var db = massive.connectSync({connectionString : connectionString});

//connect massive as above
var newDoc = {
  title : "Chicken Ate Nine",
  description: "A book about chickens of Kauai",
  price : 99.00,
  tags : [
    {name : "Simplicity", slug : "simple"},
    {name : "Fun for All", slug : "fun-for-all"}
  ]
};

var u = {
  username : "admin",
  password: "admin",
};

db.saveDoc("users", u, function(err,res) {
  console.log('manual', err, res);
  
  db.users.register(["1", "2"], function(err, newUser) {
    console.log('register', err, err.code);
    
  });
  

});
