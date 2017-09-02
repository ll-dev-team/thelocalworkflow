const fs = require("fs");
const path = require("path");
const ffprobetools = require("./ffprobetools");
var shootprocessor = require("./shootprocessor");
var dateFormat = require('dateformat');


function Clip(folderPath, camFolder, file, theIndex){
  var now = new Date();
  this.thelocalworkflowIngestTime = (dateFormat(now, "UTC:yyyy-mm-dd HH-MM-ss"));
  this.thelocalworkflowFcpxmlTime =  dateFormat(now, "yyyy-mm-dd HH:MM:ss o");
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
  for (var i = 0; i < this.ffprobeObject.streams.length; i++) {
    if (this.ffprobeObject.streams[i].codec_type == "video") {
      this.videoStreamJson = this.ffprobeObject.streams[i];
    }
    else if (this.ffprobeObject.streams[i].codec_type == "audio") {
      this.audioStreamJson = this.ffprobeObject.streams[i];
    }
  };
  // console.log(JSON.stringify(this.videoStreamJson, null, 2));
  this.width = this.videoStreamJson.width;
  this.height = this.videoStreamJson.height;
  this.codec_time_base = this.videoStreamJson.codec_time_base;
  this.time_base = this.videoStreamJson.time_base;
  this.codec_long_name = this.videoStreamJson.codec_long_name;
  this.duration = this.videoStreamJson.duration;
  this.bit_rate = this.videoStreamJson.bit_rate;
  this.nb_frames = this.videoStreamJson.nb_frames;
  if (this.videoStreamJson.tags.timecode) {
    this.startTc = this.videoStreamJson.tags.timecode
    // console.log("just made start tc for " + this.newBasenameExt + " = " + this.startTc);
  }
  else {
    this.startTc = "00:00:00:00"
  };
  if (this.videoStreamJson.tags["com.apple.quicktime.creationdate"])
    {
      this.actualCreationDate = this.videoStreamJson.tags["com.apple.quicktime.creationdate"];
      // console.log("actualCreationDate is " + dateFormat(this.actualCreationDate, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
    }
  this.duration_ts = this.videoStreamJson.duration_ts;
  this.start_ts = timeCodeToFcpxmlFormat(this.startTc);
  this.end_ts = this.start_ts + this.duration_ts;
  // console.log("start_ts: " + this.start_ts);
  // console.log("end_ts: " + this.end_ts);
  // console.log("duration_ts: " + this.duration_ts);
  this.creationDate = new Date(this.videoStreamJson.tags.creation_time);
  // console.log(this.creationDate);
  this.utcCrStartMill = this.creationDate.getTime();
  // console.log(this.utcCrStartMill);
  this.utcTcStartDate = dateFromIdTc(this.shootId, this.startTc);
  // console.log(this.utcTcStartDate);
  this.utcTcStartMill = this.utcTcStartDate.getTime();
  // console.log(this.utcTcStartMill);
  this.codec_time_base_numerator = this.time_base.split('/')[0];
  this.codec_time_base_denominator = this.time_base.split('/')[1];
  this.frameDuration = (this.videoStreamJson.r_frame_rate.split('/')[1] + "/" + this.videoStreamJson.r_frame_rate.split('/')[0] + "s");
  // console.log("in workflowobjects and this.frameDuration is " + this.frameDuration);

  // console.log("working on " + this.newBasenameExt);
  // console.log(this.width);
  this.fcpxml = {};
  this.fcpxml.format = {_attr:{frameDuration:(this.frameDuration), width:this.width, height:this.height}};
  // console.log(JSON.stringify(this.fcpxml, null, 2));
  this.fcpxml.asset = {_attr:{name: this.newBasenameExt, src: ("file://" + this.newPath), start: (timeCodeToFcpxmlFormat(this.startTc)+"/" + this.codec_time_base_denominator + "s"), duration:(this.videoStreamJson.duration_ts + "/" + this.codec_time_base_denominator + "s"), hasVideo:1, hasAudio:1, audioSources:1, audioChannels:this.audioStreamJson.channels, audioRate: this.audioStreamJson.sample_rate}};
  this.fcpxml.assetClip = [{_attr: {name: this.newBasename, audioRole:"dialogue", tcFormat:"NDF", start:(timeCodeToFcpxmlFormat(this.startTc) + "/" + this.codec_time_base_denominator + "s"), duration: (this.videoStreamJson.duration_ts + "/" + this.codec_time_base_denominator + "s"), modDate:this.thelocalworkflowFcpxmlTime}}];
  this.fcpxml.assetClip.push({keyword:  {_attr: {start:(timeCodeToFcpxmlFormat(this.startTc)), duration:(this.videoStreamJson.duration_ts + "/" + this.codec_time_base_denominator + "s"), value:(this.shootId+", "+this.cameraFolder)}}});
  this.fcpxml.assetClip.push({keyword: {_attr: {start:(timeCodeToFcpxmlFormat(this.startTc) + "/" + this.codec_time_base_denominator + "s"), duration:"24024/24000s", value:"first 24 frames"}}});
  this.fcpxml.mcAssetClip = [
        {_attr:
            {name: this.newBasenameExt,
              offset: "mcStart - thisStart",
              ref: "same as assetClip",
              audioRole:"dialogue",
              tcFormat:"NDF",
              format:"insertFORMAThere",
              start:(timeCodeToFcpxmlFormat(this.startTc)+"/" + this.codec_time_base_denominator + "s"),
              duration: (this.videoStreamJson.duration_ts + "/" + this.codec_time_base_denominator + "s")
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
  this.fcpxml = {};
  this.fcpxml.motionEffectA = {effect: {_attr:{id:"empty", name:"2.5_A", uid:"~/Effects.localized/thelocalworkflow/2.5/2.5_A/2.5_A.moef", src:"file:///Users/mk/Movies/Motion%20Templates.localized/Effects.localized/thelocalworkflow/2.5/2.5_A/2.5_A.moef"}}};
  this.fcpxml.motionEffectC = {effect: {_attr:{id:"empty", name:"2.5_C", uid:"~/Effects.localized/thelocalworkflow/2.5/2.5_C/2.5_C.moef", src:"file:///Users/mk/Movies/Motion%20Templates.localized/Effects.localized/thelocalworkflow/2.5/2.5_C/2.5_C.moef"}}};
  this.fcpxml.motionEffectB = {effect: {_attr:{id:"empty", name:"2.5_B", uid:"~/Effects.localized/thelocalworkflow/2.5/2.5_B/2.5_B.moef", src:"file:///Users/mk/Movies/Motion%20Templates.localized/Effects.localized/thelocalworkflow/2.5/2.5_B/2.5_B.moef"}}};
};


var workflowTools = {
  tcToFcpxTs: function timeCodeToFcpxmlFormat(timecode){
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
  },
  idTcToDate: function dateFromIdTc(shootId, timecode) {
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
      // console.log(shootId + "'s dateRoot " + dateRoot + " is not a valid date string");
    }
  }

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
    // console.log(shootId + "'s dateRoot " + dateRoot + " is not a valid date string");
  }
}


module.exports.Clip = Clip;
module.exports.Shoot = Shoot;
