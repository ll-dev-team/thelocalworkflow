// NOTE: you need to have ffmpeg and ffprobe installed and in folders that are in the $PATH

var args = require('minimist')(process.argv.slice(2));
const columnify = require('columnify');
const fs = require('fs');
const shootprocessor = require("./mk_modules/shootprocessor");
const fcpxml = require("./mk_modules/fcpxml");
const dateFormat = require('dateformat');
const compressor = require("./mk_modules/compressor");
const m2s = require("./mk_modules/m2s").markersToStills;
const MongoClient = require("mongodb").MongoClient, assert = require('assert');
require('dotenv').config();

// var mongoUrl = 'mongodb://localhost:27017/thelocalworkflow';

function printHelp() {
  console.log("thelocalworkflow.js (c) Marlon Kuzmick");
  console.log("");
  console.log("commands:");
  console.log("--help            print help");
  console.log("--m2s             m2s for fcpxml in {FOLDER}");
  console.log("--rename          rename files in {FOLDER}");
}

if (args.help || !(args.m2s || args.rename || args.compress)) {
  printHelp();
  process.exit(1);
}

if (args.m2s) {
  console.log("\n\n\n\n\nhaven't built this yet, but we will ultimately perform m2s on the folder you just entered.\n\n\n\n\n\n\n\n\n\n\n\n");
  // console.log(process.env.MONGODB_PATH);
  m2s(args.m2s);
  console.log("done");

}

if (args.compress) {
  console.log("\n\n\n\n\n\n\ntesting compressIt\n\n\n");
  compressor.compressIt(args.compress);
}


if (args.rename) {
  console.log("\n\n\nstarting________________________________________________\n\n\n");
  // console.log("the folder path to the files we want to rename is " + args.rename);
  var theResult = shootprocessor.rename(args.rename);
  // theResult.clipArray.forEach(function(clip){
  //   console.log("oldName = " + clip.oldBasenameExt +"\tnewName = " + clip.newBasenameExt + "\tduration for fcpxml = " + clip.fcpxmlElements.duration);
  // });
  var theResourceXml = fcpxml.makeFcpxml(theResult);
  // console.log("\n\n\nnow back in the localworkflow.  And going to log some stuff to check things out . . . \n\n\n");
  // console.log(JSON.stringify(theResult.fcpxml.motionEffectB, null, 2));
  console.log("\n\ncomplete________________________________________________\n\n");
  // console.log("creation start date: " + dateFormat(theResult.startCrDate, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
  // console.log("tc start date: " + dateFormat(theResult.startTcDate, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
  var pathForJson = (theResult.shootPath + "/_notes/" + theResult.shootId + "_shootObject.json");
  var shootObjectJson = JSON.stringify(theResult, null, 2);
  fs.writeFileSync(pathForJson, shootObjectJson);

  // MongoClient.connect(process.env.MONGODB_PATH, function(err, db) {
  //   assert.equal(null, err);
  //   console.log("Connected successfully to server");
  //   theResult.clipArray = undefined;
  //   theResult.startClip = undefined;
  //   theResult.tsStartClip = undefined;
  //   console.log(JSON.stringify(theResult, null, 4));
  //   db.collection('shoots').insertOne({theResult});
  //   db.close();
  // });


}
