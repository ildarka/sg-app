var ajv = require('ajv')();
var schema = { type : 'object', required: [ "name" ],  properties : { name : { type : 'string' }, 'password' : { type : 'string' }} };
var data = {  password: "2", state: 1 };

var validate = ajv.compile(schema);
var valid = validate(data);
if (!valid) console.log(validate.errors);

