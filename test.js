const columnify = require('columnify');
const fs = require('fs');
const shootprocessor = require("./mk_modules/shootprocessor");
const ffprobetools = require("./mk_modules/ffprobetools");
const args = require("minimist")(process.argv.slice(2));
const fcpxml = require("./mk_modules/fcpxml");
const Clip = require("./mk_modules/workflowobjects").Clip;

var array = ["apple", "orange", 3];
console.log(array);

// if (args.shootid){
//     var date = shootprocessor.dateFromId(args.shootid);
//     console.log("\n\n\n\nHello " + date.date + "\n\n\n\n");
// }

// clip1 = new Clip('/Users/mk/Desktop/desktop_20170629/stills\ practice/video/MVI_0432.MOV');
// console.log('let\'s see if we can make a new object and get duration here: ' + clip1.duration);
// fcpxml.makeFcpxml("test");
