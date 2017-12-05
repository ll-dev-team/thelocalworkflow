var express = require('express');
var router = express.Router();
// require('dotenv').config();
var mongoose = require('mongoose');
var ffmpeg = require('fluent-ffmpeg');
const fs = require("fs");
const path = require("path");
const async = require("async");

var db = mongoose.connection;
var destinationFolder = "/Volumes/mk2/tests/test_output/";

router.get('/', function(req, res, next) {
  var folderPath = "/Users/mk/Development/test_materials/_readyToProxy/";
  res.render('transcode_form', { tabTitle: 'Transcode Form', title: 'The Transcode Form', theFolderPath: folderPath });
});

router.post('/run_transcode', function(req, res){
  console.log(JSON.stringify(req.body, null, 4));
  if (req.body.urlType == "folder") {
    transcodeFolder(req.body.path, req.body.crf);
    res.send("go look at your terminal for updates");
  }
  else if (req.body.urlType == "file") {
    transcode(req.body.path, req.body.crf);
    // console.log(JSON.stringify(req.body, null, 4));
    res.json(req.body);
  }
});

function transcode(filePath, crfVal){
  var destinationFolder = "/Volumes/mk2/tests/test_output/";
  console.log("in the function");
  var fileNameExt = path.basename(filePath);
  var destinationFileName = (destinationFolder + fileNameExt);
  console.log(destinationFileName);
  var command = ffmpeg(filePath)
    .outputOptions(['-c:v libx264', '-vf format=yuv420p', '-preset slow', '-crf 23', '-c:a aac', '-b:a 128k'])
    .renice(15)
    .on('start', function(commandLine) {
    console.log('Spawned Ffmpeg with command: ' + commandLine);
  })
    .save(destinationFileName)
    .on('progress', function(progress) {
        console.log('Processing: ' + progress.percent + '% done');
        res.write('Processing: ' + progress.percent + '% done')
      });
    // next();
  // cb();
  }

function transcodeFolder(folderPath, crfVal){
    var files = fs.readdirSync(folderPath);
    var filePaths = [];
    console.log("starting off, the array is " + files);
    // clean the array
    for (var i = 0; i < files.length; i++) {
      if (!(/\.(mov|MOV|mp4|mts)$/i).test(files[i])){
        console.log(files[i] + " is not a movie file");
      }
      else {
        console.log(files[i] + "is a movie file");
        filePaths.push(path.join(folderPath, files[i]));
        // console.log("filePaths now");
        // console.log(JSON.stringify(filePaths, null, 4));
      }
    }
    console.log("we now have an array of filePaths:");
    console.log(JSON.stringify(filePaths, null, 4));

    proxyAlready = fs.readdirSync(destinationFolder);
    for (var i = 0; i < filePaths.length; i++) {
      result = false;
      for (var j = 0; j < proxyAlready.length; j++) {
        if (path.basename(filePaths[i]) == proxyAlready[j]) {
          console.log("we alread have that file, no proxy to create for " + filePaths[i]);
          result = true;
        }
        else {
        }
      }
      if (!result) {
        console.log("we need to create proxy for " + filePaths[i]);
        createProxy(filePaths[i]);
        break;
      }
    }

  }

function createProxy(filePath){
  var fileNameExt = path.basename(filePath);
  var folderPath = path.dirname(filePath);
  var destinationFileName = path.join(destinationFolder, fileNameExt);
  var command = ffmpeg(filePath)
    .outputOptions(['-c:v libx264', '-vf format=yuv420p', '-preset slow', '-crf 23', '-c:a aac', '-b:a 128k'])
    .renice(15)
    .on('start', function(commandLine) {
    console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
    .save(destinationFileName)
    .on('error', function(err, stdout){
      console.log("can't process video: " + err.message);
    })
    .on('progress', function(progress) {
        console.log('File ' + filePath + ' processing: ' + progress.percent + '% done');
        // res.write('Processing: ' + progress.percent + '% done')
      })
    .on('end', function(stdout, stderr){
      console.log("done processing " + destinationFileName);
      transcodeFolder(folderPath, 23);
    });
}

// var myVar = setInterval(myTimer, 1000);
//
// function myTimer() {
//     var d = new Date();
//     console.log(d);
// }

module.exports = router;
module.exports.transcode = transcode;
