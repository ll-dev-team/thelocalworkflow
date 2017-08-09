const fs = require("fs");
const path = require("path");
const ffprobetools = require("./ffprobetools");
var shootprocessor = require("./shootprocessor");


function Clip(folderPath, camFolder, file, theIndex){
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
  this.duration_ts = this.ffprobeObject.streams[0].duration_ts;
  this.duration = this.ffprobeObject.streams[0].duration;
  this.bit_rate = this.ffprobeObject.streams[0].bit_rate;
  this.nb_frames = this.ffprobeObject.streams[0].nb_frames;
  this.codec_time_base_numerator = this.codec_time_base.split('/')[0];
  this.codec_time_base_denominator = this.codec_time_base.split('/')[1];
  this.fcpxmlElements = {name: this.newBasenameExt, src: this.newPath, start: "add-later", duration:(this.ffprobeObject.streams[0].duration_ts + "/24000s"), hasVideo:1, hasAudio:1, audioSources:1, audioChannels:this.ffprobeObject.streams[1].channels, audioRate:this.ffprobeObject.streams[1].sample_rate};
  // ultimately loop through streams and see if one is audio first, which will determine if we actually have audio.
};

function Shoot(shootPath){
  this.shootPath = shootPath;
  this.date = "date goes here";
  this.people = [];
  this.shootId = path.basename(shootPath);

};

module.exports.Clip = Clip;
module.exports.Shoot = Shoot;
