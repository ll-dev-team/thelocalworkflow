var express = require('express');
var router = express.Router();
require('dotenv').config();
var mongoose = require('mongoose');
const fcpxml = require("../tools/workflow_tools/fcpxml");
const fs = require('fs');
const cp = require('child_process');
const _ = require('lodash');
const m2s = require("../tools/workflow_tools/m2s").markersToStills;
const investigate = require("../tools/workflow_tools/shootinvestigator").investigate;
var ffmpeg = require('fluent-ffmpeg');
const path = require('path');

var db = mongoose.connection;

function ffprobeSync(videoFilePath){
  var output = cp.spawnSync(process.env.FFPROBE_PATH, ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', videoFilePath], { encoding : 'utf8' });
  var theObject = JSON.parse((output.stdout));
  return {json: output.stdout, obj: theObject};
}

router.get('/', function(req, res, next) {
  // send the rename form to the user.
  res.render('tools/rename_form', { tabTitle: 'rename Entry Form', title: 'the Rename Form' })
});

router.post('/run_rename', function(req, res, next){
  var re = /^\./;
  console.log("initial form req.body: \n" + JSON.stringify(req.body, null, 5));
  var shootFolderCandidates = fs.readdirSync(req.body.folderPath);
  var theShootJsons = [];
  var theShootObjects = [];
  shootFolderCandidates.forEach(function(shootFolder){
    if (fs.statSync(path.join(req.body.folderPath, shootFolder)).isDirectory()) {
      console.log(shootFolder + " is a Directory");
      // var thisShoot = {shootId: "insert", clips: []}
      // var cameraFolderCandidates = fs.readdirSync(path.join(req.body.folderPath, shootFolder));
      // cameraFolderCandidates.forEach(function(cameraFolder){
      //   if (fs.statSync(path.join(req.body.folderPath, shootFolder, cameraFolder)).isDirectory()  && cameraFolder!="_notes"){
      //     console.log(cameraFolder + " is a Directory");
      //     var theClipFiles = fs.readdirSync(path.join(req.body.folderPath, shootFolder, cameraFolder));
      //     theClipFiles.forEach(function(file){
      //       if (re.test(file)) {
      //         console.log(file + " passes re test");
      //       }
      //       else {
      //         console.log(file + " does not pass re test");
      //         var filePath = path.join(req.body.folderPath, shootFolder, cameraFolder, file);
      //         console.log("running ffprobe on " + filePath);
      //         var theFfprobeResult = ffprobeSync(filePath);
      //         console.log();
      //         theShootJsons.push(theFfprobeResult.json);
      //         theShootObjects.push(theFfprobeResult.obj)
      //       }
      //     })
      //   }
      //   else {
      //     console.log(cameraFolder + " is not a Directory  or is _notes");
      //   }
      // })
      var investigatedShoot = investigate(path.join(req.body.folderPath, shootFolder));
      // console.log("\n\n\n\n\n\n++++++++++++++++++\n\n\n\n\n");
      // console.log(JSON.stringify(investigatedShoot, null, 4));
      theShootObjects.push(investigatedShoot);
      var textForFile = JSON.stringify(investigatedShoot, null, 4);
      var pathForFile = path.join('/Users/mk/Development/thelocalworkflow/tools/tests/output/json', (investigatedShoot.shootId + ".txt"));
      fs.writeFileSync(pathForFile, textForFile);
    }
    else {
      console.log(shootFolder + " is not a Directory");
    }
  })
  // TODO: structure clip data
  // TODO: grab a thumbnail from the center of each angle
  // TODO: maybe grab a thumbnail of each clip
  // console.log("\n\n\n\n\n\n\n\n\nhere is what we're sending to the ejs template: \n\n" + JSON.stringify(theShootObjects, null, 4));
  res.render('tools/rename_areusure', { tabTitle: 'rename confirmation', title: 'the Rename Form', folderPath: req.body.folderPath, people: req.body.people, shootObjects: theShootObjects })
});

router.post('/confirm_rename', function(req, res, next){
  // TODO: get the confirmation back with the shootpath and the additional data for the shoot.
  console.log(JSON.stringify(req.body));
  theText = JSON.stringify(req.body);
  console.log("the text is " + theText);
  // TODO: send to mLab
  // TODO: render confirmation response
  if (req.body.confirmation=="no") {
    res.redirect("/rename");
  }
  else {
    var theResult = rename(req.body.folderPath);
    var theResourceXml = fcpxml.makeFcpxml(theResult);
    console.log("\n\ncomplete________________________________________________\n\n");
    var pathForJson = (theResult.shootPath + "/_notes/" + theResult.shootId + "_shootObject.json");
    var shootObjectJson = JSON.stringify(theResult, null, 2);
    fs.writeFileSync(pathForJson, shootObjectJson);
    var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "<@marlon>: the shoot with id ' + theResult.shootId + ' has been ingested and renamed.", "icon_emoji": ":desktop_computer:"}'
    cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);

    // MongoClient.connect(process.env.MONGODB_PATH, function(err, db) {
    //   assert.equal(null, err);
    //   console.log("Connected successfully to server");
    //   // console.log(JSON.stringify(theResult, null, 4));
    //   db.collection('shoots').insertOne({theResult});
    //   db.close();
    // });
    console.log("\n\ndone.\n");









    res.render('rename_complete', {tabTitle: 'Rename Complete', title: 'Rename Done', reqbody: req.body})
  }
  res.send(theText);
  // res.render('rename_form', { tabTitle: 'rename confirmation', title: 'the Rename Form', folderPath: req.body.drive })

});

module.exports = router;
