var fs = require("fs");
require('dotenv').config();
var ffmpeg = require('fluent-ffmpeg');

function ffprobe (filePath) {
  ffmpeg.ffprobe(filePath, function(err, metadata) {
      console.log(JSON.stringify(metadata));
  });
}

function testIt(string) {
  console.log("it's working, and the string should be: " + string);
}



module.exports.ffprobe = ffprobe;
module.exports.echo = testIt;
