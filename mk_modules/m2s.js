const xml = require('xml');
const fs = require("fs");
const path = require("path");
const dateFormat = require('dateformat');
const xml2js = require('xml2js');
const parseXmlString = require('xml2js').parseString;
const cp = require('child_process');
const MongoClient = require("mongodb").MongoClient, assert = require('assert');

function Still(tsElements, videoFilePath, m2sPath){
  this.tsElements = tsElements
  this.videoFilePath = videoFilePath;
  this.fileExtension = path.extname(videoFilePath);
  this.stillFileName = (path.basename(videoFilePath, this.fileExtension) + "_" + tc_from_frames(this.tsElements.frames) + ".png");
  this.stillFilePath = path.join(m2sPath, this.stillFileName);
  cp.spawnSync(process.env.FFMPEG_PATH, ['-ss', this.tsElements.seconds, '-i', videoFilePath, '-vframes', '1', this.stillFilePath]);
}

function toMongo(stillArray){
  MongoClient.connect(process.env.MONGODB_PATH, function(err, db) {
    assert.equal(null, err);
    stillArray.forEach(function(still){
      db.collection('stills').insertOne({still});
    });
    db.close();
});
}

function markersToStills(folderPath) {
  // TODO: loop folder to get all stills fcpxmls (test if ends with fcpxml)
  // TODO: add to mongodb
  var now = new Date();
  var stillArray = [];
  console.log("Starting markersToStills at " + (dateFormat(now, "yyyymmdd HH:MM:ss")));
  var xmlFiles = fs.readdirSync(folderPath);
  // loop folderPath
  xmlFiles.forEach(function(thisXmlFile){
    var thisXmlPath = path.join(folderPath,thisXmlFile);
    console.log("the path I'm trying to read as xml is " + thisXmlPath);
    // read and parse xml file
    var xml2test = fs.readFileSync(thisXmlPath, 'UTF-8');
    parseXmlString(xml2test, function (err, result) {
      if (err) {
        console.log(err);
      }
      else
      {    var pathForJson = ("/Users/mk/Development/test_materials/exports/testing2stills.json");
        extrasFilePathString = result.fcpxml.resources[0].asset[0].$.src.replace('file:///','/');
        filePathStringElements = extrasFilePathString.split('/').slice(1, -2);
        thePath = "/";
        for (var i = 0; i < filePathStringElements.length; i++) {
          thePath=path.join(thePath, filePathStringElements[i]);
        }
        m2sPath=(path.join(thePath, "_m2s"));
        if (fs.existsSync(thePath)) {
          fs.mkdirSync(m2sPath);
          for (var i = 0; i < result.fcpxml.library[0].event[0].project.length; i++) {
            // TODO: change this to a regex
            if (result.fcpxml.library[0].event[0].project[i].$.name.includes("till")) {
              var theProject = result.fcpxml.library[0].event[0].project[i];
            }
          }
          for (var i = 0; i < theProject.sequence[0].spine[0]["asset-clip"].length; i++) {
            var videoFileName = theProject.sequence[0].spine[0]["asset-clip"][i].$.name;
            var videoFileStartTs = theProject.sequence[0].spine[0]["asset-clip"][i].$.start;
            var theClip = result.fcpxml.resources[0].asset.filter(function(clip){
              return clip.$.id === theProject.sequence[0].spine[0]["asset-clip"][i].$.ref
            });
            var videoFilePath = theClip[0].$.src.replace('file:///','/');
            // determine start for this camera
            findMarkers(theProject.sequence[0].spine[0]["asset-clip"][i], videoFilePath, stillArray, videoFileStartTs, m2sPath);
          }
        }
        else {
          console.log("the path is " + thePath);
          console.log("something is wrong--the path to the original media as defined in the fcpxml doesn't seem to exist--you may need to relink files");
        }
      }
    });
  });
  toMongo(stillArray);
}

function tc_from_frames(frames){
  var the_frames=(frames % 24);
  var seconds = (frames-the_frames)/24;
  var the_seconds=(seconds%60);
  var minutes = (seconds-the_seconds)/60;
  var the_minutes = minutes%60;
  var the_hours = (minutes-the_minutes)/60;
  var tc_string = ((("00" + the_hours).slice(-2))+(("00" + the_minutes).slice(-2))+(("00" + the_seconds).slice(-2))+(("00" + the_frames).slice(-2)))
  return tc_string
};

function fcpxmlStartToSeconds(fcpxmlStart, videoFileStartTs){
  console.log("videoFileStartTs is" + videoFileStartTs);
  var thisNumerator = fcpxmlStart.split('/')[0];
  var thisDenominator = fcpxmlStart.split('/')[1].replace('s','');
  var thisFrames = ((24000/thisDenominator)*thisNumerator)/1001;
  var thisFileStartTsNumerator = videoFileStartTs.split('/')[0];
  var thisFileStartTsDenominator = videoFileStartTs.split('/')[1].replace('s','');
  var thisStartFrames = ((24000/thisFileStartTsDenominator)*thisFileStartTsNumerator)/1001;
  var theSecondsStart = thisFileStartTsNumerator/thisFileStartTsDenominator;
  var theSecondsMarker = thisNumerator/thisDenominator;
  var theSeconds = theSecondsMarker - theSecondsStart;
  console.log(theSecondsMarker + " - " + theSecondsStart + " = " + theSeconds);
  return {numerator: thisNumerator, denominator: thisDenominator, seconds: theSeconds, frames: thisFrames, fileStartFrames: thisStartFrames, fcpxmlFileStart: videoFileStartTs};
}

function findMarkers(projectAssetClip, videoFilePath, stillArray, videoFileStartTs, m2sPath){
  console.log("in findMarkers");
  projectAssetClip.marker.forEach(function(marker, index){
    console.log("logging marker.$.start"+JSON.stringify(marker.$.start, null, 2));
    var tsElements = fcpxmlStartToSeconds(marker.$.start, videoFileStartTs);
    console.log("timestampSeconds is " + tsElements.seconds +" and the frames are " + tsElements.frames);
    var thisStill = new Still(tsElements, videoFilePath, m2sPath);
    stillArray.push(thisStill);
  });
};

module.exports.markersToStills = markersToStills;
