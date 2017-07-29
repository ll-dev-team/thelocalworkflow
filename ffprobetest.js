require('dotenv').config();
var ffmpeg = require('fluent-ffmpeg');

// make sure you set the correct path to your video file
ffmpeg.ffprobe('/Users/mk/Development/Clip_2.mov',function(err, metadata) {
  console.log(JSON.stringify(metadata));
});
