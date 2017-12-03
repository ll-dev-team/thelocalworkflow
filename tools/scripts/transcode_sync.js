const xml = require('xml');
const fs = require("fs");
const path = require("path");
const dateFormat = require('dateformat');
const cp = require('child_process');

var destinationFolder = "/Volumes/mk2/_test_materials/test_output/"

function transcode(filePath, crfVal){
  var fileNameExt = path.basename(filePath);
  var destinationFileName = (destinationFolder + fileNameExt);
  console.log("transcode will happen here on path \n" + filePath);
  console.log("and we'll put it here: \n" + destinationFileName);
  console.log(process.env.FFMPEG_PATH);
  // the following is equivalent to ffmpeg -i [PATH] -c:v libx265 -vf format=yuv420p -preset slow -crf 28 -c:a aac -b:a 128k [DEST]
  // for instance
  // ffmpeg -i /Volumes/mk2/tests/test_footage/C300_original.mov -c:v libx265 -vf format=yuv420p -preset slow -crf 28 -c:a aac -b:a 128k /Volumes/mk2/tests/test_output/result.mov
  //  -pix_fmt yuv420p instead?

  var output = cp.spawnSync(process.env.FFMPEG_PATH, ['-i', filePath, '-c:v', 'libx264', '-vf', 'format=yuv420p', '-preset', 'slow', '-crf', crfVal, '-c:a', 'aac', '-b:a', '128k', destinationFileName]);
  console.log("done");
  console.log("\n\n");

  // TODO: insert if to copy audio entirely if we have weird channel number or other situation
  // ffmpeg -i input.avi -c:v libx264 -preset slow -crf 22 -c:a copy output.mkv
  // ffmpeg -i input -c:v libx265 -crf 28 -c:a aac -b:a 128k output.mp4
  }

module.exports.transcode = transcode;
