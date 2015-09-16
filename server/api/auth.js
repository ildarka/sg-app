'use strict';

var login = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  if (!sgapp.errors) {
    //Put your code here
    sgapp.send("Ok");
  }
};

var logout = function(sgapp) {
  
  sgapp.validate();
  sgapp.accessControl();
  
  if (!sgapp.errors) {
    //Put your code here
    sgapp.send("Ok");
  }
};


module.exports.login = login;
module.exports.logout = logout;
