const columnify = require('columnify');
const fs = require('fs');
const shootprocessor = require("./mk_modules/shootprocessor");
const ffprobetools = require("./mk_modules/ffprobetools");
const args = require("minimist")(process.argv.slice(2));
const fcpxml = require("./mk_modules/fcpxml");
const Clip = require("./mk_modules/workflowobjects").Clip;

var array = ["apple", "orange", 3];
console.log(array);
