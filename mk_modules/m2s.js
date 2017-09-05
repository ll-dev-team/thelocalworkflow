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

function markersToStills(folderPath) {

  // TODO: path to ffmpeg (dev_folder replacement)
  // TODO: path for stills to export (path_for_stills replacement)
  // TODO: path for the fcpxml files ()
  // TODO: loop folder to get all stills fcpxmls (test if ends with fcpxml)
  // TODO: add to mongodb

  var now = new Date();
  var stillArray = [];
  console.log("Starting markersToStills at " + (dateFormat(now, "yyyymmdd HH:MM:ss")));
  // console.log(tc_from_frames(442371));

  // loop folderPath
  var xmlFiles = fs.readdirSync(folderPath);
  xmlFiles.forEach(function(thisXmlFile){
    var thisXmlPath = path.join(folderPath,thisXmlFile);
    console.log("the path I'm trying to read as xml is " + thisXmlPath);
    var xml2test = fs.readFileSync(thisXmlPath, 'UTF-8');
    parseXmlString(xml2test, function (err, result) {
      if (err) {
        console.log(err);
      }
      else
    {    var pathForJson = ("/Users/mk/Development/test_materials/exports/testing2stills.json");
        // var xmlJson = JSON.stringify(result, null, 2);
        // fs.writeFileSync(pathForJson, xmlJson);
        extrasFilePathString = result.fcpxml.resources[0].asset[0].$.src.replace('file:///','/');
        filePathStringElements = extrasFilePathString.split('/').slice(1, -2);
        thePath = "";
        for (var i = 0; i < filePathStringElements.length; i++) {
          thePath=path.join(thePath, filePathStringElements[i]);
          console.log(thePath + "+++++++++++++++++++++++++");
        }


        m2sPath=("/" + path.join(thePath, "_m2s"));
        // console.log("\n\n\n\n\n\n\n\n" + extrasFilePathString + "\n\n\n\n\n\n\n");
        // console.log("\n\n\n\n\n\n\n\n" + filePathStringElements + "\n\n\n\n\n\n\n");
        console.log("\n\n\n\n\n\n\n\n" + m2sPath + "\n\n\n\n\n\n\n");

        if (fs.existsSync(thePath)) {
          fs.mkdirSync(m2sPath);
          console.log(JSON.stringify(result, null, 4));
          for (var i = 0; i < result.fcpxml.library[0].event[0].project.length; i++) {
            // TODO: change this to a regex
            if (result.fcpxml.library[0].event[0].project[i].$.name.includes("till")) {
              var theProject = result.fcpxml.library[0].event[0].project[i];

            }
          }
          console.log("success---------------------------");
          console.log(JSON.stringify(theProject, null, 4));
          for (var i = 0; i < theProject.sequence[0].spine[0]["asset-clip"].length; i++) {
            var videoFileName = theProject.sequence[0].spine[0]["asset-clip"][i].$.name;
            var videoFileStartTs = theProject.sequence[0].spine[0]["asset-clip"][i].$.start;
            var theClip = result.fcpxml.resources[0].asset.filter(function(clip){
              return clip.$.id === theProject.sequence[0].spine[0]["asset-clip"][i].$.ref
            });
            var videoFilePath = theClip[0].$.src.replace('file:///','/');
            console.log("theClipPath is " + videoFilePath + "and start ts is " + videoFileStartTs);
            console.log("\n\n");
            // determine start for this camera
            findMarkers(theProject.sequence[0].spine[0]["asset-clip"][i], videoFilePath, stillArray, videoFileStartTs, m2sPath);
            // console.log(stillArray);

          }
        }
        else {
          console.log("something is wrong--the path to the original media as defined in the fcpxml doesn't seem to exist--you may need to relink files");
        }



      }
    });
      // MongoClient.connect(process.env.MONGODB_PATH, function(err, db) {
      //   assert.equal(null, err);
      //   stillArray.forEach(function(still){
      //     console.log(process.env.MONGODB_PATH);
      //     db.collection('stills').insertOne({still});
      //   });
      //
      //   db.close();




  });
}

function tc_from_frames(frames){
  var the_frames=(frames % 24);
  // console.log("the_frames are "+ the_frames);
  var seconds = (frames-the_frames)/24;
  // console.log("seconds are "+ seconds);
  var the_seconds=(seconds%60);
  // console.log("the_seconds are "+ the_seconds);
  var minutes = (seconds-the_seconds)/60;
  var the_minutes = minutes%60;
  var the_hours = (minutes-the_minutes)/60;
  var tc_string = ((("00" + the_hours).slice(-2))+(("00" + the_minutes).slice(-2))+(("00" + the_seconds).slice(-2))+(("00" + the_frames).slice(-2)))
  // console.log("something like " + tc_string);
  return tc_string
};

function stills_from_fcpxml(fcpxml_path){

  };

function fcpxmlStartToSeconds(fcpxmlStart, videoFileStartTs){
  // console.log(fcpxmlStart);
  console.log("videoFileStartTs is" + videoFileStartTs);
  var thisNumerator = fcpxmlStart.split('/')[0];
  var thisDenominator = fcpxmlStart.split('/')[1].replace('s','');
  // console.log(thisNumerator);
  // console.log(thisDenominator);
  var thisFrames = ((24000/thisDenominator)*thisNumerator)/1001;
  var thisFileStartTsNumerator = videoFileStartTs.split('/')[0];
  var thisFileStartTsDenominator = videoFileStartTs.split('/')[1].replace('s','');
  var thisStartFrames = ((24000/thisFileStartTsDenominator)*thisFileStartTsNumerator)/1001;
  var theSecondsStart = thisFileStartTsNumerator/thisFileStartTsDenominator;
  var theSecondsMarker = thisNumerator/thisDenominator;
  var theSeconds = theSecondsMarker - theSecondsStart;
  console.log(theSecondsMarker + " - " + theSecondsStart + " = " + theSeconds);
  // console.log("there are "+ thisFrames +" frames.");
  return {numerator: thisNumerator, denominator: thisDenominator, seconds: theSeconds, frames: thisFrames, fileStartFrames: thisStartFrames, fcpxmlFileStart: videoFileStartTs};
}




function findMarkers(projectAssetClip, videoFilePath, stillArray, videoFileStartTs, m2sPath){
  console.log("in findMarkers");
  // console.log("projectAssetClip is " + JSON.stringify(projectAssetClip, null, 2));
  projectAssetClip.marker.forEach(function(marker, index){
    console.log("logging marker.$.start"+JSON.stringify(marker.$.start, null, 2));
    var tsElements = fcpxmlStartToSeconds(marker.$.start, videoFileStartTs);
    console.log("timestampSeconds is " + tsElements.seconds +" and the frames are " + tsElements.frames);
    var thisStill = new Still(tsElements, videoFilePath, m2sPath);
    stillArray.push(thisStill);
  });
};


module.exports.markersToStills = markersToStills;




// def still_mysql_insert(still_filename, tc_request, shoot_id, clocktime, notes):
//     cnx = mysql.connector.connect(user='root', password='root', port='3306', host='127.0.0.1', database='learning_lab')
//     cursor = cnx.cursor()
//     mysql_command="""
//     INSERT INTO test_stills (shoot_id, filename, tc_request, clocktime, notes) VALUES (%s, %s, %s, %s, %s)
//     """
//     values=(shoot_id, still_filename, tc_request, clocktime, notes)
//     cursor.execute(mysql_command, values)
//     #print('just tried to execute')
//     cnx.commit()
//     cnx.close()
