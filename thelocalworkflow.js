function printHelp() {
  console.log("thelocalworkflow.js (c) Marlon Kuzmick");
  console.log("");
  console.log("usage:");
  console.log("--help             print help");
  console.log("--m2s             m2s for fcpxml in {FOLDER}");
  console.log("--rename      rename files in {FOLDER}");
}

var args = require('minimist')(process.argv.slice(2));
var columnify = require('columnify');
var fs = require('fs');
var shootprocessor = require("./mk_modules/shootprocessor")

if (args.help || !(args.m2s || args.rename || args.shootfolder)) {
  printHelp();
  process.exit(1);
}

if (args.m2s) {
  console.log("haven't built this yet, but we will ultimately perform m2s on the folder you just entered.");
}

if (args.rename) {
  console.log("the folder path to the files we want to rename is " + args.rename);
  var theResult = shootprocessor.rename(args.rename);
  theResult.clipArray.forEach(function(clip){
    console.log("oldName = " + clip.oldBasenameExt +"\tnewName = " + clip.newBasenameExt + "\tduration for fcpxml = " + clip.fcpxmlElements.duration);
  });
}
