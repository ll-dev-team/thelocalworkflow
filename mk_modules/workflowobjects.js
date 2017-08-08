const fs = require("fs");
const path = require("path");
const ffprobetools = require("./ffprobetools");
var shootprocessor = require("./shootprocessor");


function Clip(clipPath){
  this.ffprobeOutput=ffprobetools.ffprobeSync(clipPath);
  videoMetaObject = JSON.parse(this.ffprobeOutput);
  this.path = clipPath;
  // console.log(this.ffprobeOutput);
  this.width = videoMetaObject.streams[0].width;
  this.height = videoMetaObject.streams[0].height;
  this.codec_time_base = videoMetaObject.streams[0].codec_time_base;
  this.codec_long_name = videoMetaObject.streams[0].codec_long_name;
  this.duration_ts = videoMetaObject.streams[0].duration_ts;
  this.duration = videoMetaObject.streams[0].duration;
  this.bit_rate = videoMetaObject.streams[0].bit_rate;
  this.nb_frames = videoMetaObject.streams[0].nb_frames;
  this.codec_time_base_numerator = this.codec_time_base.split('/')[0];
  this.codec_time_base_denominator = this.codec_time_base.split('/')[1];
  var ext = path.extname(clipPath);
  var basename = path.basename(clipPath, ext);
  this.fcpxmlElements = {name: basename, src: this.path, start: "add-later", duration:(videoMetaObject.streams[0].duration_ts + "/24000s"), hasVideo:1, hasAudio:1, audioSources:1, audioChannels:videoMetaObject.streams[1].channels, audioRate:videoMetaObject.streams[1].sample_rate};
  // ultimately loop through streams and see if one is audio first, which will determine if we actually have audio.

// also add:
// ID: needs to correlate to the position in the array
// src: file:// + filePath
// format: r1 ----  needs to be dynamic and not hard coded ultimately

};

module.exports.Clip = Clip;
