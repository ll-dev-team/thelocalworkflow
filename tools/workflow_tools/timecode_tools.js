var fs = require("fs");
var path = require("path");
var ffprobeSync = require("./ffprobetools").ffprobeSync;
var moment = require('moment');
var colors = require('colors/safe');
const {promisify} = require('util');
const statAsync = promisify(fs.stat);

function logTimecode(path, cb){
  getAllData(path)
    .then(data=>makeSlate(data))
    .then(theResult=>{console.log("\n\ntrying cb\n\n"); cb(theResult)})
    .catch(err=>{console.log("there was an error\n\n" + err + "\n\n")});
}

async function getAllData(path){
  let allData = {};
  allData.statData = await statAsync(path);
  allData.ffprobeData = await JSON.parse(ffprobeSync(path));
  return allData;
};

function makeSlate(data){
  console.log(colors.blue("in make slate with blue data:" + JSON.stringify(data, null, 4)));
  var result = data;
  result.slate = {
    cameraTcUtc: data.statData.birthtimeMs,
    cameraTime: moment(data.ffprobeData.streams[0].tags.creation_time).valueOf(),
    frames: tcToFrames(data.ffprobeData.streams[0].tags.timecode),
    clockTime: data.statData.birthtimeMs,
    clockTimeString: data.statData.birthtime,
    cameraTcString: data.ffprobeData.streams[0].tags.timecode,
    description: "temp---delete when in production"
  };
  result.prettyFileCreationDate = moment(data.statData.birthtimeMs).format("YYYYMMDD HH:mm:ss.SSS");
  result.prettyFileCreationDateFfprobe = moment(data.ffprobeData.streams[0].tags.creation_time).format("YYYYMMDD HH:MM:ss.SSS");
  return result;
}

function tcToFrames(tc){
  var frames = tc.split(":")[0]*60*60*24
    + tc.split(":")[1]*60*24
    + tc.split(":")[2]*24
    + tc.split(":")[3];
  return frames;
}

module.exports.logTimecode = logTimecode;
