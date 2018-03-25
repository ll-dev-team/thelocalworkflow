const fs = require('fs');
const path = require('path');
const cp = require('child_process');
var colors = require('colors/safe');
const parseXmlString = require('xml2js').parseString;
require('dotenv').config();
const workingDir = path.join(process.env.ROOT_DIR, 'public/images/temp/video');
const gifDir = path.join(process.env.ROOT_DIR, 'public/images/gif');

function ffprobeVideoSync(videoFilePath){
  // this is equivalent of running "ffprobe -v quiet -print_format json -show_format -show_streams [file]"
  var output = cp.spawnSync(process.env.FFPROBE_PATH, ['-v', 'quiet', '-print_format', 'json', '-show_format', '-select_streams', 'V',  '-show_streams', videoFilePath], { encoding : 'utf8' });
  // console.log('\n\n\nGoing to add this, we hope.\n\n');
  // console.log(output.stdout);
  // var video_meta = JSON.parse(output.stdout);
  return JSON.parse(output.stdout);
  // console.log(video_meta.streams[0].codec_long_name);
}

function makeGif(filePath, outputWidth){
  console.log("\n\n . . . starting the makeGif function . . . \n\n");
  var fileName = path.basename(filePath, path.extname(filePath));
  var fileInfo = ffprobeVideoSync(filePath);
  console.log(colors.gray(JSON.stringify(fileInfo, null, 4)));
  console.log("the dimensions for " + filePath + " are " + fileInfo.streams[0].width + " x " + fileInfo.streams[0].height);
  var aspectRatio = fileInfo.streams[0].width/fileInfo.streams[0].height;
  console.log("aspectRatio is " + aspectRatio);
  var newHeight = outputWidth/aspectRatio;
  if (fs.existsSync(path.join(gifDir, (fileName+'.gif')))) {
    console.log(colors.red("this gif already exists--take a look and try again?"));
    return;
  }
  cp.spawnSync(process.env.FFMPEG_PATH, [
    '-i', filePath,
    '-vf', 'palettegen', (path.join(gifDir, (fileName + '-palette.png')))],
    {encoding:'utf8'});
  cp.spawnSync(process.env.FFMPEG_PATH, [
      '-i', filePath,
      '-i', (path.join(gifDir, (fileName + '-palette.png'))),
      '-vf', ('scale=' + outputWidth + ':' + newHeight),
      '-y', (path.join(gifDir, (fileName+'.gif'))) ],
      {encoding:'utf8'});
  fs.unlinkSync((path.join(gifDir, (fileName + '-palette.png'))))
}

function makeGifFromPngs(filePath, outputWidth){
  console.log("\n\n . . . starting the makeGif function . . . \n\n");
  var fileName = path.basename(filePath, path.extname(filePath));
  var fileInfo = ffprobeVideoSync(filePath);
  console.log(colors.gray(JSON.stringify(fileInfo, null, 4)));
  console.log("the dimensions for " + filePath + " are " + fileInfo.streams[0].width + " x " + fileInfo.streams[0].height);
  var aspectRatio = fileInfo.streams[0].width/fileInfo.streams[0].height;
  console.log("aspectRatio is " + aspectRatio);
  var newHeight = outputWidth/aspectRatio;
  if (fs.existsSync(path.join(gifDir, (fileName+'.gif')))) {
    console.log(colors.red("this gif already exists--take a look and try again?"));
    return;
  }
  cp.spawnSync(process.env.FFMPEG_PATH, [
    '-i', filePath,
    '-vf', ('scale=' + outputWidth + ':' + newHeight),
    "/Users/mk/Development/_tests/png/frames/%03d.png"
    ],
    {encoding:'utf8'});
  cp.spawnSync(process.env.FFMPEG_PATH, [
    '-i', "/Users/mk/Development/_tests/png/frames/%03d.png",
    '-vf', 'palettegen', (path.join(gifDir, (fileName + '-palette.png')))],
    {encoding:'utf8'});
  cp.spawnSync(process.env.FFMPEG_PATH, [
      '-i', "/Users/mk/Development/_tests/png/frames/%03d.png",
      '-i', (path.join(gifDir, (fileName + '-palette.png'))),
      '-lavfi', 'paletteuse,setpts=2*PTS',
      '-y', (path.join(gifDir, (fileName+'.gif'))) ],
      {encoding:'utf8'});
  // fs.unlinkSync((path.join(gifDir, (fileName + '-palette.png'))))
}

function folderToGifs(folderPath, outputWidth){
  console.log("\n\n . . . starting the folderToGifs function . . . \n\n");
  var videoFiles = fs.readdirSync(folderPath);
  videoFiles.forEach(function(videoFile){
    var ext = path.extname(videoFile).toLowerCase();
    console.log(ext);
    if (ext == ".mov" || ext == ".mp4" || ext == ".m4v") {
      console.log("converting " + videoFile + " to gif");
      makeGif(path.join(folderPath, videoFile), outputWidth)
    }
  })
}

function io2gif(videoFilePath, inPoint, outPoint, maxWidth){
  videoSegment = makeVideoSegment(videoFilePath, inPoint, outPoint);
  makeGif(videoSegment.videoFilePath, maxWidth);
}

function makeVideoSegment(videoFilePath, inPoint, outPoint){
  var fileName = path.basename(videoFilePath, path.extname(videoFilePath));
  cp.spawnSync(process.env.FFMPEG_PATH,
    [
      '-i', videoFilePath,
      '-ss', inPoint, // -ss 00:00:30
      '-c:v', 'prores',
      '-c:a', 'copy',
      '-to', outPoint, // -t 00:00:05
      (path.join(workingDir, (fileName+'-segment.mov')))
    ]);
  return {rootDir: workingDir, videoFileName: (fileName+'-segment.mov'), videoFilePath: (path.join(workingDir, (fileName+'-segment.mov')))}
}

function fcpxmlToGif (fcpxmlPath){
  var baseName = path.basename(fcpxmlPath, '.fcpxml')
  var xmlToCheck = fs.readFileSync(fcpxmlPath, 'UTF-8');
  parseXmlString(xmlToCheck, function(err, result){
    if (err) {
      console.log(err);
    }
    else {
      fs.writeFileSync(path.join(workingDir, (baseName + ".json")), JSON.stringify(result, null, 4));
      var gifClipArray = [];
      var fileArray = [];
      result.fcpxml.resources[0].asset.forEach(function(asset){
        fileArray.push(asset.$)
      });
      fileArray.forEach(function(asset){
        console.log(asset.name);
        console.log(asset.src);
        console.log(asset.start);
        console.log(asset.duration);
      })
      // console.log(JSON.stringify(result.fcpxml.library, null, 4));
      console.log("length of library events is " + result.fcpxml.library[0].event.length);
      for (var i = 0; i < result.fcpxml.library[0].event.length; i++) {
        console.log("working on event " + result.fcpxml.library[0].event[i].$.name);
        if (result.fcpxml.library[0].event[i].clip){
          result.fcpxml.library[0].event[i].clip.forEach(function(clip){
            console.log("working on clip " + clip.$.name);
            if (clip.keyword) {
              clip.keyword.forEach(function(kw){
                if (kw.$.value.includes("gif") && kw.$.duration) {
                  console.log(colors.green("Need a gif from " + clip.$.name + " running from " + kw.$.start + " for " + kw.$.duration));
                  var thisAsset = (fileArray.filter(asset => asset.name == clip.$.name))[0];
                  console.log(JSON.stringify(thisAsset));
                  var inPointTcSec=fcpxmlToSeconds(kw.$.start);
                  console.log(inPointTcSec);
                  var durationSec= fcpxmlToSeconds(kw.$.duration);
                  console.log(durationSec);
                  console.log(colors.green(thisAsset.start));
                  var inPointSec = (fcpxmlToSeconds(kw.$.start) - fcpxmlToSeconds(thisAsset.start));
                  console.log(inPointSec);
                  gifClipArray.push({
                    inPointSec: inPointSec,
                    durationSec: durationSec,
                    outPointSec: (inPointSec + durationSec),
                    videoFilePath: (thisAsset.src.replace('file:///','/'))
                  })
                }
              })
            }
          })
        }
        if (result.fcpxml.library[0].event[i]["asset-clip"] ){
          result.fcpxml.library[0].event[i]["asset-clip"].forEach(function(clip){
            console.log("working on asset-clip " + clip.$.name);
            if (clip.keyword) {
              clip.keyword.forEach(function(kw){
                if (kw.$.value.includes("gif") && kw.$.duration) {
                  console.log(colors.green("Need a gif from " + clip.$.name + " running from " + kw.$.start + " for " + kw.$.duration));
                }
              })
              // console.log(colors.magenta(JSON.stringify(clip.keyword, null, 4)));
            }
          })
        }
        if (result.fcpxml.library[0].event[i]["mc-clip"]){
          result.fcpxml.library[0].event[i]["mc-clip"].forEach(function(clip){
            // console.log("working on mc-clip " + clip.$.name);
            if (clip.keyword) {
              clip.keyword.forEach(function(kw){
                if (kw.$.value.includes("gif") && kw.$.duration) {
                  console.log(colors.red("If you need a gif from " + clip.$.name + " running from " + kw.$.start + " for " + kw.$.duration + ", you need to go back and grab it from the clips themselves rather than the multiclip."));
                }
              })
              // console.log(colors.magenta(JSON.stringify(clip.keyword, null, 4)));
            }
          })
        }
        if (result.fcpxml.library[0].event[i]["ref-clip"]){
          result.fcpxml.library[0].event[i]["ref-clip"].forEach(function(clip){
            console.log("working on ref-clip " + clip.$.name);
            if (clip.keyword) {
              clip.keyword.forEach(function(kw){
                if (kw.$.value.includes("gif") && kw.$.duration) {
                  console.log(colors.red("Need a gif from " + clip.$.name + " running from " + kw.$.start + " for " + kw.$.duration + ", you need to go back and grab it from the clips themselves rather than the compound clip."));
                }
              })
              // console.log(colors.magenta(JSON.stringify(clip.keyword, null, 4)));
            }
          })
        }
      }
      console.log(colors.magenta(JSON.stringify(gifClipArray, null, 4)));
      gifClipArray.forEach(function(gifClip){
        console.log("about to create clip with " + gifClip.videoFilePath);
        var thisVideoSegment = makeVideoSegment(gifClip.videoFilePath, gifClip.inPointSec, gifClip.outPointSec);
        makeGif(thisVideoSegment.videoFilePath, 640);
      })
    }
  })
}

function fcpxmlToSeconds(fcpxmlString){
  var thisNumerator = fcpxmlString.split('/')[0];
  var thisDenominator = fcpxmlString.split('/')[1].replace('s','');
  var thisSeconds = (thisNumerator/thisDenominator);
  return thisSeconds;
}

module.exports.makeGif = makeGif;
module.exports.io2gif = io2gif;
module.exports.fcpxmlToGif = fcpxmlToGif;
module.exports.folderToGifs = folderToGifs;
module.exports.makeGifFromPngs = makeGifFromPngs;
