var fs = require("fs");
var path = require("path");
var ffprobeSync = require("./ffprobetools").ffprobeSync;
var moment = require('moment');
const {promisify} = require('util');
const statAsync = promisify(fs.stat); // (A)


async function getAllData(path){
  let allData = {};
  allData.statData = await statAsync(path);
  allData.ffprobeData = await JSON.parse(ffprobeSync(path));
  return allData;
};

function logTimecode(path, cb){
  getAllData(path)
    .then(data=>calcOffset(data))
    .then(theResult=>{console.log("\n\ntrying cb\n\n"); cb({result: theResult})})
    // .then(theResult=>{console.log(theResult.text); return theResult})
    // .then(theNewResult=>{console.log(theNewResult.offset); return theNewResult})
    // .then(finalResult=>{cb(err, finalResult)})
    .catch(err=>{console.log("there was an error\n\n" + err + "\n\n")});
}

function calcOffset(data){
  // console.log("\n\nin calcOffset\n\n" + JSON.stringify(data, null, 4));
  var result = {allData: data};
  // TODO: loop through streams and only execute on video and tc channels (and look for discrepancies between the two)
  // console.log("all data: " + JSON.stringify(data, null, 4));
  console.log("\n\n\nResults:\n\ndata.statData.birthtime: " + data.statData.birthtime + "\ndata.statData.mtime: " + data.statData.mtime + "\ndata.streams[0].tags.creation_time: " + data.ffprobeData.streams[0].tags.creation_time + "\ndata.streams[0].tags.timecode: " + data.ffprobeData.streams[0].tags.timecode);
  result.text = ("\n\ndata.statData.birthtime: " + data.statData.birthtime + "\ndata.statData.mtime: " + data.statData.mtime + "\ndata.streams[0].tags.creation_time: " + data.ffprobeData.streams[0].tags.creation_time + "\ndata.streams[0].tags.timecode: " + data.ffprobeData.streams[0].tags.timecode);
  result.offset = "offset will go here";
  result.prettyFileCreationDate = moment(data.statData.birthtimeMs).format("YYYYMMDD HH:mm:ss.SSS");
  result.prettyFileCreationDateFfprobe = moment(data.ffprobeData.streams[0].tags.creation_time).format("YYYYMMDD HH:MM:ss.SSS");
  return result;
}

module.exports.logTimecode = logTimecode;
