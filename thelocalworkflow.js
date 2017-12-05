var args = require('minimist')(process.argv.slice(2));
const columnify = require('columnify');
const fs = require('fs');
const shootprocessor = require("./ll_modules/shootprocessor");
const fcpxml = require("./ll_modules/fcpxml");
const dateFormat = require('dateformat');
const compressor = require("./ll_modules/compressor");
const m2s = require("./ll_modules/m2s").markersToStills;
const m2sf = require("./ll_modules/m2s").fcpxmlFileToStills;
const MongoClient = require("mongodb").MongoClient, assert = require('assert');
const cp = require('child_process');
const path = require('path');
// const transcode = require("./tools/scripts/transcode").transcode;
const transcode = require("./tools/scripts/transcode_sync").transcode;
const io2s = require("./tools/scripts/io2s").io2s;
const xml = require('xml');

var reHidden = /^\./;


const csv=require('csvtojson')


require('dotenv').config();

// var mongoUrl = 'mongodb://localhost:27017/thelocalworkflow';

function printHelp() {
  console.log("thelocalworkflow.js (c) Marlon Kuzmick");
  console.log("");
  console.log("commands:");
  console.log("--help            print help");
  console.log("--m2s             m2s for fcpxml in {FOLDER}");
  console.log("--m2sf            m2s for fcpxml in {FILE}");
  console.log("--rename          rename files in {FOLDER}");
  console.log("--transcode       transcode files in {FOLDER}");
}

if (args.help || !(args.m2s || args.rename || args.compress || args.m2sf || args.shootdata || args.transcode || args.io2s)) {
  printHelp();
  process.exit(1);
}

if (args.m2s) {
  console.log("\n\n\n\n\nhaven't built this yet, but we will ultimately perform m2s on the folder you just entered.\n\n\n\n\n\n\n\n\n\n\n\n");
  // console.log(process.env.MONGODB_PATH);
  var m2sOutput = m2s(args.m2s);
  console.log("done the stills--now prepping payload and sending to Slack");
  var theMessage = ""
  m2sOutput.forEach(file => theMessage= (theMessage + file.stillFileName + "\n"));
  var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "<@marlon>: new stills have been exported: ' + theMessage + ' ", "icon_emoji": ":camera:"}'
  cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);
  console.log("done");
}

if (args.m2sf){
  var m2sOutput = m2sf(args.m2sf);
  console.log("done the stills--now prepping payload and sending to Slack");
  var theMessage = ""
  m2sOutput.forEach(file => theMessage= (theMessage + file.stillFileName + "\n"));
  var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "<@marlon>: new stills have been exported: ' + theMessage + ' ", "icon_emoji": ":camera:"}'
  cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);
  console.log("done");
}

if (args.compress) {
  console.log("\n\n\n\n\n\n\ntesting compressIt\n\n\n");
  compressor.compressIt(args.compress);
}

if (args.rename) {
  console.log("\n\n\nstarting________________________________________________\n\n\n");
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
  var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "<@marlon>: the shoot with id ' + theResult.shootId + ' has been ingested and renamed.", "icon_emoji": ":desktop_computer:"}';

  cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);

  MongoClient.connect(process.env.MONGODB_PATH, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    // console.log(JSON.stringify(theResult, null, 4));
    db.collection('shoots').insertOne({theResult});
    db.close();
  });
  console.log("\n\ndone.\n");
}

if (args.shootdata) {
  // TODO: comment this AND similar line in shootprocessor and replace with process.env.X
  var re = /^\./;
  var logLocation = '/Users/mk/Development/_tests/calcSize';
  console.log("\n\n\nstarting________________________________________________\n\n\n");
  var folders = fs.readdirSync(args.shootdata);
  folders.forEach(function(shootFolder){
    if (fs.statSync(path.join(args.shootdata,shootFolder)).isDirectory()) {
      console.log(shootFolder);
      var theResult = shootprocessor.getShootInfo(shootFolder);
      console.log("\n\ncomplete________________________________________________\n\n");
    }
    else {
      console.log("not a shootFolder");
    }

    }
    // else {}
  );
  console.log("\n\ndone.\n");
};

if (args.io2s) {
  // var sourceXmlPath = args.xml;
  var sourceXmlPath = './tools/examples/example.xml';
  var ioExample = require("./tools/data/io2sExample.json");
  console.log("starting io2s");
  io2s(ioExample, sourceXmlPath);
  console.log("done");

}

if (args.transcode) {
  // var destRoot = '/Volumes/06_01/Proxy_Footage/2017_12_Proxy'
  var destRoot = '/Volumes/mk2/_test_materials/test_output'
  console.log(JSON.stringify(args, null, 8));
  var crfVal = 23
  if (args.crf) {
    crfVal = args.crf
  }
  else {
    crfVal = 23;
  }
  if (args.folder) {
    var argElements = args.folder.split('/');
    console.log(argElements);
    console.log(argElements.length);
    var shootId = args.folder.split('/')[(args.folder.split('/').length - 1)];
    console.log("is this the shootId? --- " + shootId);
    var destFolder = path.join(destRoot, shootId + '_h264_1080');
    if (!fs.existsSync(destFolder)){
        fs.mkdirSync(destFolder);
    }
    var camfoldersToTranscode = fs.readdirSync(args.folder);
    console.log(camfoldersToTranscode);
    for (var i = 0; i < camfoldersToTranscode.length; i++) {
      var subFolder = path.join(args.folder, camfoldersToTranscode[i]);
      if (fs.statSync(subFolder).isDirectory()) {
        console.log("this is a directory: " + subFolder);
        var filesToTranscode = fs.readdirSync(subFolder);
        console.log(JSON.stringify(filesToTranscode, null, 4));
        filesToTranscode.forEach(fileName=>{
          var videoFilePath = path.join(subFolder, fileName);
          var vfDestinationPath = path.join(destFolder, fileName);
          if ((/\.(mov|MOV|mp4|m4v|mts)$/i).test(videoFilePath)) {
            console.log("we think this is a video: " + videoFilePath);
            console.log("and it's destination will be " + vfDestinationPath);
            transcode(videoFilePath, vfDestinationPath, crfVal)
          }
          else {
            console.log("we don't think this is a video: " + videoFilePath);
          }
        });
      }
      else {
        console.log("we don't think that this is a directory: " + path.join(args.folder, camfoldersToTranscode[i]));
      }
    }

  }
  else {
    console.log("didn't get expected input.  you have to add a folder with the --folder flag");
    // transcode(args.transcode, crfVal);
  }

}
