'use strict';

{{#each methods}}
{{{methodbody}}}
{{/each}}

{{#each methods}}
module.exports.{{methodname}} = {{methodname}};
{{/each}}
