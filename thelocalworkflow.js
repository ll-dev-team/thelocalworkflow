var args = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const shootprocessor = require("./tools/workflow_tools/shootprocessor");
const fcpxml = require("./tools/workflow_tools/fcpxml");
const compressor = require("./tools/workflow_tools/compressor");
const m2s = require("./tools/workflow_tools/m2s").markersToStills;
const m2sf = require("./tools/workflow_tools/m2s").fcpxmlFileToStills;
const MongoClient = require("mongodb").MongoClient, assert = require('assert');
const cp = require('child_process');
const path = require('path');
const transcode = require("./tools/scripts/transcode_sync").transcode;
const gifMachine = require("./tools/workflow_tools/gif_machine");
const io2s = require("./tools/scripts/io2s").io2s;
const popFcpxml = require("./tools/scripts/populate_fcpxml");
// var reHidden = /^\./;
var theDate = new Date;
require('dotenv').config();
var mongoDB = process.env.MONGODB_URL;
const colors = require('colors/safe');
// var mongoDB = process.env.MONGODB_URL_DEV;
// mongoose.connect(mongoDB);
// var db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function printHelp() {
  console.log("thelocalworkflow.js (c) Marlon Kuzmick");
  console.log("");
  console.log("commands:");
  console.log("--help            print help");
  console.log("--m2s             m2s for fcpxml in {FOLDER}");
  console.log("--m2sf            m2s for fcpxml in {FILE}");
  console.log("--rename          rename files in {FOLDER} and generate fcpxml");
  console.log("--simplerename    rename files in {FOLDER}");
  console.log("--transcode       transcode files in {FOLDER} with ffmpeg");
  console.log("--compress        transcode files in {FOLDER} with compressor");
}

if (args.help ||
    !(args.m2s
      || args.rename
      || args.simplerename
      || args.compress
      || args.m2sf
      || args.shootdata
      || args.transcode
      || args.io2s
      || args.populate
      || args.gif
      || args.fcpxmlToGif
      || args.makeGifFromPngs
      || args.folderToGifs
      || args.io2gif
      || args.test)
  ) {
        printHelp();
        process.exit(1);
    }

if (args.test) {
  console.log(__basedir + "the rest");
}

if (args.io2s) {
  var theJson = require(args.json);
  var pathForXml = (args.json.split('.')[0] + '_' + theDate.getTime() + '.fcpxml');
  var pathForJson = (args.json.split('.')[0] + '_' + theDate.getTime() + '.json');
  console.log("starting io2s");
  io2s(theJson, args.xml, pathForXml, pathForJson, args.title);
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
  var m2sfOutput = m2sf(args.m2sf);
  console.log("done the stills--now prepping payload and sending to Slack");
  var theMessage = ""
  m2sfOutput.forEach(file => theMessage= (theMessage + file.stillFileName + "\n"));
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
  console.log("\n\ncomplete________________________________________________\n\n");
  var theResourceXml = fcpxml.makeFcpxml(theResult);
  console.log("\n\ncomplete________________________________________________\n\n");
  var pathForJson = (theResult.shootPath + "/_notes/" + theResult.shootId + "_shootObject.json");
  var shootObjectJson = JSON.stringify(theResult, null, 2);
  fs.writeFileSync(pathForJson, shootObjectJson);
  var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "<@marlon>: the shoot with id ' + theResult.shootId + ' has been ingested and renamed.", "icon_emoji": ":desktop_computer:"}';
  cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);
  MongoClient.connect(process.env.MONGODB_URL, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db.collection('shoots').insertOne({theResult});
    db.close();
  });
  console.log("\n\ndone.\n");
}

if (args.simplerename) {
  console.log("\n\n\nstarting________________________________________________\n\n\n");
  var theResult = shootprocessor.rename(args.simplerename);
  console.log("\n\ncomplete________________________________________________\n\n");
  var pathForJson = (theResult.shootPath + "/_notes/" + theResult.shootId + "_shootObject.json");
  var shootObjectJson = JSON.stringify(theResult, null, 2);
  fs.writeFileSync(pathForJson, shootObjectJson);
  var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "<@marlon>: the shoot with id ' + theResult.shootId + ' has been ingested and renamed.", "icon_emoji": ":desktop_computer:"}';
  cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);
  MongoClient.connect(process.env.MONGODB_URL, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
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

if (args.populate) {
  if (args.folder) {
    console.log("about to populate " + mongoDB);
    popFcpxml.fcpxmlFolderToDb(args.folder);

  }
  else if (args.file) {
    console.log("about to populate " + mongoDB);
    popFcpxml.fcpxmlFileToDb(args.file);

  }
  else {
    console.log("input a file or a folder");
    db.close();
  }
  // if (args.fcpxml) {
  //   popFcpxml(args.fcpxml);
}

if (args.transcode) {
  // var destRoot = '/Volumes/06_01/Proxy_Footage/2017_12_Proxy'
  var destRoot = '/Users/mk/Development/test_materials/exports'
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

if (args.gif) {
  gifMachine.makeGif(args.gif, 960);
  console.log(colors.green('done.'));
}

if (args.io2gif) {
  gifMachine.io2gif(args.io2gif, 2.3, 6.43, 960);
  console.log(colors.green('done.'));
}

if (args.fcpxmlToGif) {
  console.log("starting fcpxmlToGif--warning, this is SLOW and not optimized yet.");
  gifMachine.fcpxmlToGif(args.fcpxmlToGif)
}

if (args.folderToGifs) {
  console.log("starting folderToGifs--warning, this is SLOW and not optimized yet.");
  gifMachine.folderToGifs(args.folderToGifs, 480)
}

if (args.makeGifFromPngs) {
  console.log("starting makeGifFromPngs--warning, this is SLOW and not optimized yet.");
  gifMachine.makeGifFromPngs(args.makeGifFromPngs, 480)
}
