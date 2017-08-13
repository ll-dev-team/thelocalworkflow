const fs = require("fs");
const path = require("path");
var dateFormat = require('dateformat');
const xml = require('xml');

function resourceMediaMulticam(shootObject){
  var cameras = shootObject.cameraArray;
  var clipToPush = {media: [{_attr: {}}, {multicam: [{_attr: {format: }}, ]}]}
  var tempXml = xml(clipToPush);
  console.log(tempXml);
};

function That(shootPath){

};
module.exports.This = This;
module.exports.That = That;
