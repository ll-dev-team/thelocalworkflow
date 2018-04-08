const xml = require('xml');
const fs = require("fs");
const path = require("path");
const dateFormat = require('dateformat');
const cp = require('child_process');
const ffprobetools = require("./ffprobetools");

function transcode(sourcePath, destinationPath, crfVal, outputWidth, outputHeight){
  console.log('\n\n\nin the transcode function\n\n');
  console.log("transcode will happen here on path \n" + sourcePath);
  console.log("and we'll put it here: \n" + destinationPath);
  // console.log(process.env.FFMPEG_PATH);
  // the following is equivalent to ffmpeg -i [PATH] -c:v libx265 -vf format=yuv420p -preset slow -crf 28 -c:a aac -b:a 128k [DEST]
  // for instance
  // ffmpeg -i /Volumes/mk2/tests/test_footage/C300_original.mov -c:v libx265 -vf format=yuv420p -preset slow -crf 28 -c:a aac -b:a 128k /Volumes/mk2/tests/test_output/result.mov
  //  -pix_fmt yuv420p instead?

  var output = cp.spawnSync(process.env.FFMPEG_PATH, ['-i', sourcePath, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-vf', ('scale='+ outputWidth +':'+outputHeight ), '-preset', 'slow', '-crf', crfVal, '-c:a', 'aac', '-b:a', '128k', destinationPath]
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

function getDesiredDimensions(videoFilePath){
  var options = ['-v', 'error', '-print_format', 'json', '-select_streams', 'v:0', '-show_entries', 'stream=width,height'];
  var output = JSON.parse(ffprobetools.ffprobeSyncSimple(videoFilePath, options));
  var outputWidth=1920;
  var outputHeight=1080;
  console.log(output.streams[0].width + " is the width");
  if (output.streams[0].height && (output.streams[0].height>1080)) {
    console.log(videoFilePath + " has height larger than 1080: " + output.streams[0].height);
    outputWidth=output.streams[0].width/(output.streams[0].height/1080);
    console.log("making outputWidth " + outputWidth);
  }
  else if (output.streams[0].height && (output.streams[0].height==1080)) {
    console.log(videoFilePath + " has height of exactly 1080: " + output.streams[0].height);
  }
  else if (output.streams[0].height && (output.streams[0].height<1080)) {
    console.log(videoFilePath + " has height of less than 1080: " + output.streams[0].height);
    outputWidth=output.streams[0].width;
    outputHeight=output.streams[0].height;
  }
  else {
    console.log("something went wrong--perhaps this is not a video file");
  }
  return {outputWidth: outputWidth, outputHeight: outputHeight};
}

module.exports.transcode = transcode;
module.exports.getDesiredDimensions = getDesiredDimensions;
