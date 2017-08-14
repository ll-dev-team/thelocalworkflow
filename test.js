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


var testObject = {};
testObject.media = [];
testObject.media.push({_attr: {name: "objectName"}});
testObject.media.push({clip: {_attr: {name: "ClipName", width: "1920"}}});




var clips = [{_attr: {name: "clip1", width: "1020"}}, {_attr: {name: "clip2", width: "2920"}}, {_attr: {name: "clip3", width: "5920"}}, {_attr: {name: "clip4", width: "10"}}, {_attr: {name: "clip5", width: "190"}}];
var widths = clips.map(function(clip, index, clips){
  return clip._attr.width;
});


var result = Math.max.apply(Math,clips.map(function(o){return o._attr.width;}));
console.log("result is " + result);
var obj = clips.find(function(o){ return o._attr.width == result; })
console.log(JSON.stringify(obj, null, 4));

//
// console.log(JSON.stringify(widths, null, 4));
//
//
//
//
// console.log(xml(testObject, {indent:'\t'}));
