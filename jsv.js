var JSV = require("jsv").JSV;
var json = {};
var env = JSV.createEnvironment();

var report = env.validate({ name : "1", password: "2", state: 1 }, { type : 'object', "required": [ "state" ],  properties : { name : { type : 'string' }, 'password' : { type : 'string' }} });
console.log(report.errors);

