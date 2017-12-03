// const xml = require('xml');
// const fs = require("fs");
// const path = require("path");
// const dateFormat = require('dateformat');
// const cp = require('child_process');
//
// var destinationFolder = "/Volumes/mk2/_test_materials/test_output/"
//
// function transcode(filePath, crfVal){
//   var fileNameExt = path.basename(filePath);
//   var destinationFileName = (destinationFolder + fileNameExt);
//   console.log("transcode will happen here on path \n" + filePath);
//   console.log("and we'll put it here: \n" + destinationFileName);
//   console.log(process.env.FFMPEG_PATH);
//   // the following is equivalent to ffmpeg -i [PATH] -c:v libx265 -vf format=yuv420p -preset slow -crf 28 -c:a aac -b:a 128k [DEST]
//   // for instance
//   // ffmpeg -i /Volumes/mk2/tests/test_footage/C300_original.mov -c:v libx265 -vf format=yuv420p -preset slow -crf 28 -c:a aac -b:a 128k /Volumes/mk2/tests/test_output/result.mov
//   //  -pix_fmt yuv420p instead?
//
//   var output = cp.spawnSync(process.env.FFMPEG_PATH, ['-i', filePath, '-c:v', 'libx264', '-vf', 'format=yuv420p', '-preset', 'slow', '-crf', crfVal, '-c:a', 'aac', '-b:a', '128k', destinationFileName], {
//   stdio: [
//     0, // Use parent's stdin for child
//     'pipe', // Pipe child's stdout to parent
//     2 // Direct child's stderr to a file
//   ]
// });
//   console.log("done");
//   console.log("\n\n");
//
//   // TODO: insert if to copy audio entirely if we have weird channel number or other situation
//   // ffmpeg -i input.avi -c:v libx264 -preset slow -crf 22 -c:a copy output.mkv
//   // ffmpeg -i input -c:v libx265 -crf 28 -c:a aac -b:a 128k output.mp4
//   }
//
// module.exports.transcode = transcode;
//
//

const xml = require('xml');
const fs = require("fs");
const path = require("path");
const dateFormat = require('dateformat');
const cp = require('child_process');

// var destinationFolder = "/Volumes/mk2/_test_materials/test_output/"

function transcode(sourcePath, destinationPath, crfVal){
  console.log('\n\n\nin the transcode function\n\n');
  console.log("transcode will happen here on path \n" + sourcePath);
  console.log("and we'll put it here: \n" + destinationPath);
  // console.log(process.env.FFMPEG_PATH);
  // the following is equivalent to ffmpeg -i [PATH] -c:v libx265 -vf format=yuv420p -preset slow -crf 28 -c:a aac -b:a 128k [DEST]
  // for instance
  // ffmpeg -i /Volumes/mk2/tests/test_footage/C300_original.mov -c:v libx265 -vf format=yuv420p -preset slow -crf 28 -c:a aac -b:a 128k /Volumes/mk2/tests/test_output/result.mov
  //  -pix_fmt yuv420p instead?
  console.log(process.env.FFMPEG_PATH);
  var output = cp.spawnSync(process.env.FFMPEG_PATH, ['-i', sourcePath, '-c:v', 'libx264', '-vf', 'format=yuv420p', '-preset', 'slow', '-crf', crfVal, '-c:a', 'aac', '-b:a', '128k', destinationPath]
  , {
    stdio: [
      0, // Use parent's stdin for child
      'pipe', // Pipe child's stdout to parent
      2 // Direct child's stderr to a file
    ]
  }
);
  console.log("done");
  var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "<@marlon>: just transcoded ' + path.basename(sourcePath) + ' and put it here: ' + destinationPath + ' .", "icon_emoji": ":desktop_computer:"}';
  cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);
  console.log("\n\n");

  // TODO: insert if to copy audio entirely if we have weird channel number or other situation
  // ffmpeg -i input.avi -c:v libx264 -preset slow -crf 22 -c:a copy output.mkv
  // ffmpeg -i input -c:v libx265 -crf 28 -c:a aac -b:a 128k output.mp4
  }

module.exports.transcode = transcode;
