const columnify = require('columnify');
const fs = require('fs');
const shootprocessor = require("./mk_modules/shootprocessor");
const ffprobetools = require("./mk_modules/ffprobetools");
const args = require("minimist")(process.argv.slice(2));
const fcpxml = require("./mk_modules/fcpxml");
const Clip = require("./mk_modules/workflowobjects").Clip;
const xml = require("xml");

// var array = ["apple", "orange", [0, 2, 3]];
// console.log(array[2][1]);
//
//
// var testObject = {};
// testObject.media = [];
// testObject.media.push({_attr: {name: "objectName"}});
// testObject.media.push({clip: {_attr: {name: "ClipName", width: "1920"}}});
//
// var numbers = [1, 5, 10, 15];
// var doubles = numbers.map(function(x) {
//    return x * 2;
// });
// // doubles is now [2, 10, 20, 30]
// // numbers is still [1, 5, 10, 15]
//
// var numbers = [1, 4, 9];
// var roots = numbers.map(Math.sqrt);
//
//
// var clips = [{_attr: {name: "clip1", width: "1920"}}, {_attr: {name: "clip2", width: "1920"}}, {_attr: {name: "clip3", width: "1920"}}, {_attr: {name: "clip4", width: "1920"}}, {_attr: {name: "clip5", width: "1920"}}];
// var widths = clips.map(function(clip, index, clips){
//   return clip._attr.width;
// });
//
// console.log(JSON.stringify(widths, null, 4));
//
//
//
//
// console.log(xml(testObject, {indent:'\t'}));

var now = new Date();
console.log(now.getTime());

var someDate = new Date('Mon, 25 Dec 1995 13:30:00 GMT');
var theUnixTime = someDate.getUnixTime();
