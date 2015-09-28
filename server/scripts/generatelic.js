#!/usr/bin/env node
var argv = require('yargs').argv;
var path = require('path');
var fs = require('fs');

var dst = '/../license/';

/*
var sn = argv.sn;
var ports = argv.ports.toString();
var mirror = argv.mirror;
var mpls = argv.mpls;
if (mirror) fname +=  '_MR';
if (mpls) fname += '_MS';
fname += '.lic';
*/

//console.log(sn, ports);
var fname = dst + argv.filename;

fs.writeFileSync(path.resolve(__dirname + fname), "licence mock", "utf8");

process.exit(0);
