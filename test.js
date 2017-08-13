const columnify = require('columnify');
const fs = require('fs');
const shootprocessor = require("./mk_modules/shootprocessor");
const ffprobetools = require("./mk_modules/ffprobetools");
const args = require("minimist")(process.argv.slice(2));
const fcpxml = require("./mk_modules/fcpxml");
const Clip = require("./mk_modules/workflowobjects").Clip;
const xml = require("xml");

var array = ["apple", "orange", [0, 2, 3]];
console.log(array[2][1]);


var testObject = {};
testObject.media = [];
testObject.media.push({_attr: {name: "objectName"}});
testObject.media.push({clip: {_attr: {name: "ClipName", width: "1920"}}});


console.log(xml(testObject, {indent:'\t'}));
