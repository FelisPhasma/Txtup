#!/usr/bin/env node
"use strict";
let path = require("path"),
    appPath = path.dirname(process.argv[1]),
    exec = require('child_process').exec,
    pkg = require( path.join(__dirname, 'package.json') ),
    program = require('commander'),
    walk = require('walk');
program
	.version(pkg.version)
	.arguments('<dir>')
	.parse(process.argv);
let child = exec(`node ${appPath + "\\main.js " + process.argv[2]} "${path.resolve(".")}"`);
child.stdout.on('data', function(data) {
    console.log(data.toString().replace(/\n/gi, "")); 
});
child.on('close', function (code) {
    console.log("text-markup exited with code ", code);
    process.exit(code);
});
