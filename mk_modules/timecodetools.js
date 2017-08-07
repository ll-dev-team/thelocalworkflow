var fs = require("fs");
require('dotenv').config();
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

function ffprobeSync(videoFilePath){
  var output = cp.spawnSync('ffprobe', ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', videoFilePath], { encoding : 'utf8' });
  console.log('\n\n\nGoing to add this, we hope.\n\n');
  console.log(output.stdout);
  console.log('\n\n\n\n\n');
  var video_meta = JSON.parse(output.stdout);
  console.log(video_meta.streams[0].codec_long_name);
}

function testIt(string) {
  console.log("it's working, and the string should be: " + string);
}



module.exports.ffprobe = ffprobe;
module.exports.ffprobeSync = ffprobeSync;
module.exports.echo = testIt;
