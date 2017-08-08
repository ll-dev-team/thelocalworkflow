var fs = require("fs");
var ffmpeg = require('fluent-ffmpeg');
const cp = require('child_process');

function ffprobe (filePath, array) {
  ffmpeg.ffprobe(filePath, array, function(err, metadata) {
      console.log("in the ffprobe function");
      console.log(JSON.stringify(metadata));
      array.push(JSON.stringify(metadata));
      // array.push({file: filePath, ffprobe: metadata})
  });
}

function testIt(string) {
  console.log("it's working, and the string should be: " + string);
}


module.exports.ffprobe = ffprobe;
module.exports.echo = testIt;
