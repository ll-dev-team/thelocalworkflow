const fs = require("fs");
const path = require("path");
const ffprobetools = require("./ffprobetools");
var shootprocessor = require("./shootprocessor");
var dateFormat = require('dateformat');

function Clip(folderPath, camFolder, file, theIndex){
  var now = new Date();
  this.thelocalworkflowIngestTime = (dateFormat(now, "UTC:yyyy-mm-dd HH-MM-ss"));
  // console.log("is this the date? " + this.thelocalworkflowIngestTime);
  this.oldBasenameExt = file;
  this.oldPath = path.join(folderPath, camFolder, file);
  this.cameraFolder = camFolder;
  this.shootId=path.basename(folderPath);
  this.counter = ("000" + (theIndex + 1)).slice(-3);
  this.ffprobeOutput=ffprobetools.ffprobeSync(this.oldPath);
  this.ffprobeObject=JSON.parse(this.ffprobeOutput);
  // console.log(this.ffprobeOutput);
  this.ext = path.extname(file);
  this.newBasename = (this.shootId + "_" + camFolder + "_" + this.counter)
  this.newBasenameExt = (this.newBasename + this.ext)
  this.newPath = path.join(folderPath, camFolder, this.newBasenameExt);
  this.width = this.ffprobeObject.streams[0].width;
  this.height = this.ffprobeObject.streams[0].height;
  this.codec_time_base = this.ffprobeObject.streams[0].codec_time_base;
  this.codec_long_name = this.ffprobeObject.streams[0].codec_long_name;
  this.duration_ts = this.ffprobeObject.streams[0].duration_ts;
  this.duration = this.ffprobeObject.streams[0].duration;
  this.bit_rate = this.ffprobeObject.streams[0].bit_rate;
  this.nb_frames = this.ffprobeObject.streams[0].nb_frames;
  if (this.ffprobeObject.streams[0].tags.timecode) {
    this.startTc = this.ffprobeObject.streams[0].tags.timecode
  }
  else {
    this.startTc = "00:00:00:00"
  };
  // console.log("timeCodeToFcpxmlFormat function returns " + timeCodeToFcpxmlFormat(this.startTc));
  // console.log("this.startTc is" + this.startTc);
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
  // ultimately loop through streams and see if one is audio first, which will determine if we actually have audio.
};

function Shoot(shootPath){
  this.shootPath = shootPath;
  this.people = [];
  this.shootId = path.basename(shootPath);
  this.shootIdDate = this.shootId.split('_')
  this.dateStart = "date goes here";
  this.shootCounter = this.shootId;
  this.projectId
};

function timeCodeToFcpxmlFormat(timecode){
  var tempTc = ("willBeAFunctionOf " + timecode);
  theHours = parseInt(timecode.split(':')[0]);
  theMinutes = parseInt(timecode.split(':')[1]);
  theSeconds = parseInt(timecode.split(':')[2]);
  theFrames = parseInt(timecode.split(':')[3]);
  // console.log("theHours=" + theHours);
  // console.log("theMinutes=" + theMinutes);
  // console.log("theSeconds=" + theSeconds);
  // console.log("theFrames=" + theFrames);
  theTotalFrames = (theFrames)+(24*(theSeconds+(60*(theMinutes+(60*theHours)))));
  // console.log(theTotalFrames);
  theFcpxFormat = ((theTotalFrames*1001) + "/24000s");
  // console.log(theFcpxFormat);
  return theFcpxFormat;
};
//
// function timeCodeToFcpxmlStart (ffprobeObject){
//   // var theHrs = ffprobeObject.streams[0].tags.timecode.
//   var theStart = ("itWillBeAFunctionOf" + ffprobeObject.streams[0].tags.timecode);
//   return theStart;
// };


function dateFromId(shootId) {
  // console.log("working in dateFromId with " + shootId);
  var regexTest = /^\d{8}/;
  var dateRoot = shootId.slice(0,8);
  if (regexTest.test(dateRoot)) {
    var y = dateRoot.substr(0,4),
        m = (dateRoot.substr(4,2) - 1),
        d = dateRoot.substr(6,2);
    var D = new Date(y,m,d);
    console.log("the date is " + D);
    return {dateString:dateRoot, date: D};
  }
  else {
    // console.log(shootId + "'s dateRoot " + dateRoot + " is not a valid date string");
  }
}


module.exports.Clip = Clip;
module.exports.Shoot = Shoot;
