const fs = require("fs");
const path = require("path");
const ffprobetools = require("./ffprobetools");
var shootprocessor = require("./shootprocessor");
var dateFormat = require('dateformat');

function Clip(folderPath, camFolder, file, theIndex){
  var now = new Date();
  this.thelocalworkflowIngestTime = (dateFormat(now, "UTC:yyyy-mm-dd HH-MM-ss"));
  this.oldBasenameExt = file;
  this.oldPath = path.join(folderPath, camFolder, file);
  this.cameraFolder = camFolder;
  this.shootId=path.basename(folderPath);
  this.counter = ("000" + (theIndex + 1)).slice(-3);
  this.ffprobeOutput=ffprobetools.ffprobeSync(this.oldPath);
  this.ffprobeObject=JSON.parse(this.ffprobeOutput);
  this.ext = path.extname(file);
  this.newBasename = (this.shootId + "_" + camFolder + "_" + this.counter)
  this.newBasenameExt = (this.newBasename + this.ext)
  this.newPath = path.join(folderPath, camFolder, this.newBasenameExt);
  this.width = this.ffprobeObject.streams[0].width;
  this.height = this.ffprobeObject.streams[0].height;
  this.codec_time_base = this.ffprobeObject.streams[0].codec_time_base;
  this.codec_long_name = this.ffprobeObject.streams[0].codec_long_name;
  this.duration = this.ffprobeObject.streams[0].duration;
  this.bit_rate = this.ffprobeObject.streams[0].bit_rate;
  this.nb_frames = this.ffprobeObject.streams[0].nb_frames;
  if (this.ffprobeObject.streams[0].tags.timecode) {
    this.startTc = this.ffprobeObject.streams[0].tags.timecode
  }
  else {
    this.startTc = "00:00:00:00"
  };
  if (this.ffprobeObject.streams[0].tags["com.apple.quicktime.creationdate"])
    {
      this.actualCreationDate = this.ffprobeObject.streams[0].tags["com.apple.quicktime.creationdate"];
      // console.log("actualCreationDate is " + dateFormat(this.actualCreationDate, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
    }
  this.duration_ts = this.ffprobeObject.streams[0].duration_ts;
  this.start_ts = timeCodeToFcpxmlFormat(this.startTc);
  this.end_ts = this.start_ts + this.duration_ts;
  // console.log("start_ts: " + this.start_ts);
  // console.log("end_ts: " + this.end_ts);
  // console.log("duration_ts: " + this.duration_ts);
  this.creationDate = new Date(this.ffprobeObject.streams[0].tags.creation_time);
  // console.log(this.creationDate);
  this.utcCrStartMill = this.creationDate.getTime();
  // console.log(this.utcCrStartMill);
  this.utcTcStartDate = dateFromIdTc(this.shootId, this.startTc);
  // console.log(this.utcTcStartDate);
  this.utcTcStartMill = this.utcTcStartDate.getTime();
  // console.log(this.utcTcStartMill);
  this.codec_time_base_numerator = this.codec_time_base.split('/')[0];
  this.codec_time_base_denominator = this.codec_time_base.split('/')[1];
  // console.log("working on " + this.newBasenameExt);
  // console.log(this.width);
  this.fcpxml = {};
  this.fcpxml.format = {_attr:{frameDuration:(this.codec_time_base+"s"), width:this.width, height:this.height}};
  // console.log(JSON.stringify(this.fcpxml, null, 2));
  this.fcpxml.asset = {_attr:{name: this.newBasenameExt, src: ("file://" + this.newPath), start: (timeCodeToFcpxmlFormat(this.startTc)), duration:(this.ffprobeObject.streams[0].duration_ts + "/" + this.codec_time_base_denominator + "s"), hasVideo:1, hasAudio:1, audioSources:1, audioChannels:this.ffprobeObject.streams[1].channels, audioRate: this.ffprobeObject.streams[1].sample_rate}};
  this.fcpxml.assetClip = [{_attr: {name: this.newBasename, audioRole:"dialogue", tcFormat:"NDF", start:(timeCodeToFcpxmlFormat(this.startTc)), duration: (this.ffprobeObject.streams[0].duration_ts + "/" + this.codec_time_base_denominator + "s"), modDate:this.thelocalworkflowIngestTime}}];
  this.fcpxml.assetClip.push({keyword:  {_attr: {start:(timeCodeToFcpxmlFormat(this.startTc)), duration:(this.ffprobeObject.streams[0].duration_ts + "/" + this.codec_time_base_denominator + "s"), value:(this.shootId+", "+this.cameraFolder)}}});
  this.fcpxml.assetClip.push({keyword: {_attr: {start:(timeCodeToFcpxmlFormat(this.startTc)), duration:"24024/24000s", value:"first 24 frames"}}});
  this.fcpxml.mcAssetClip = [
        {_attr:
            {name: this.newBasenameExt,
              offset: "mcStart - thisStart",
              ref: "same as assetClip",
              audioRole:"dialogue",
              tcFormat:"NDF",
              start:(timeCodeToFcpxmlFormat(this.startTc)),
              duration: (this.ffprobeObject.streams[0].duration_ts + "/" + this.codec_time_base_denominator + "s")
            }
          },
          {"audio-channel-source":
            {_attr:
              {role:"dialogue.dialogue-1", srcCh:"1"}}},
          {"audio-channel-source":
            {_attr:
              {role:"dialogue.dialogue-2", srcCh:"2"}}}
          ];
  // ultimately loop through streams and see if one is audio first, which will determine if we actually have audio.
};

function Shoot(shootPath){
  this.shootPath = shootPath;
  this.people = [];
  this.cameraArray = [];
  this.clipArray = [];
  this.shootId = path.basename(shootPath);
  this.shootIdDate = this.shootId.split('_')[0];
  this.shootCounter = this.shootId.split('_')[1];
  this.projectId = this.shootId.split('_')[2];
  this.subId = this.shootId.split('_')[3];
};

function timeCodeToFcpxmlFormat(timecode){
  var tempTc = ("willBeAFunctionOf " + timecode);
  var theHours = parseInt(timecode.split(':')[0]);
  var theMinutes = parseInt(timecode.split(':')[1]);
  var theSeconds = parseInt(timecode.split(':')[2]);
  var theFrames = parseInt(timecode.split(':')[3]);
  // console.log("theHours=" + theHours);
  // console.log("theMinutes=" + theMinutes);
  // console.log("theSeconds=" + theSeconds);
  // console.log("theFrames=" + theFrames);
  var theTotalFrames = (theFrames)+(24*(theSeconds+(60*(theMinutes+(60*theHours)))));
  // console.log(theTotalFrames);
  // var theFcpxFormat = ((theTotalFrames*1001) + "/24000s");
  var theFcpxFormat = (theTotalFrames*1001);
  // console.log(theFcpxFormat);
  return theFcpxFormat;
};
//
// function timeCodeToFcpxmlStart (ffprobeObject){
//   // var theHrs = ffprobeObject.streams[0].tags.timecode.
//   var theStart = ("itWillBeAFunctionOf" + ffprobeObject.streams[0].tags.timecode);
//   return theStart;
// };


function dateFromIdTc(shootId, timecode) {
  // console.log("working in dateFromId with " + shootId);
  var regexTest = /^\d{8}/;
  var dateRoot = shootId.slice(0,8);
  if (regexTest.test(dateRoot)) {
    var y = dateRoot.substr(0,4),
        m = (dateRoot.substr(4,2) - 1),
        d = dateRoot.substr(6,2);
    var theHours = parseInt(timecode.split(':')[0]),
        theMinutes = parseInt(timecode.split(':')[1]),
        theSeconds = parseInt(timecode.split(':')[2]),
        theFrames = parseInt(timecode.split(':')[3]);
    var theTotalFrames = (theFrames)+(24*(theSeconds+(60*(theMinutes+(60*theHours)))));
    var D = new Date(y,m,d, theHours, theMinutes, theSeconds);
    // console.log(y,m,d, theHours, theMinutes, theSeconds);
    // console.log("the date is " + D);
    return D;
  }
  else {
    console.log(shootId + "'s dateRoot " + dateRoot + " is not a valid date string");
  }
}


module.exports.Clip = Clip;
module.exports.Shoot = Shoot;
