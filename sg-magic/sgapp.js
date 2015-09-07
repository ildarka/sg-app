'use strict';


var sgApp = {
  'r' : {},
  'user' : {},
  'validate':  function(params, schema) {
    return {status: true, error: []};
  },
  'accessControl': function() {
    return true;
  },
  'response': function(data) {
    this.socket.emit('xxx', data);
  },
  'error': function() {
    
  }
};



module.exports = sgApp;