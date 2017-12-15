const fs = require("fs");
const path = require("path");
var dateFormat = require('dateformat');

function This(folderPath, camFolder, file, theIndex){
  var now = new Date();
  this.objectCreationTime = (dateFormat(now, "UTC:yyyy-mm-dd HH-MM-ss"));
};

function That(shootPath){

};
module.exports.This = This;
module.exports.That = That;
