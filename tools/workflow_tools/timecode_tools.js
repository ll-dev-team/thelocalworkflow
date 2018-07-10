var fs = require("fs");
var path = require("path");
var ffprobeSync = require("./ffprobetools").ffprobeSync;
const {promisify} = require('util');
const statAsync = promisify(fs.stat); // (A)


async function getAllData(path){
  let allData = {};
  allData.statData = await statAsync(path);
  allData.ffprobeData = await JSON.parse(ffprobeSync(path));
  return allData;
};

function logTimecode(path){
  getAllData(path)
    .then(data=>calcOffset(data))
    .then(theResult=>{console.log(theResult.text); return theResult})
    .then(theNewResult=>{console.log(theNewResult.offset)})
    .catch(err=>{console.log("there was an error\n\n" + err + "\n\n")});
}

function calcOffset(data){
  var result = { };
  result.text = "\n\ngot your data:\n\n";
  result.text += JSON.stringify(data, null, 4);
  result.text += "\n\nso basically it worked.\n\n";
  result.offset = "offset will go here"
  return result;
}

module.exports.logTimecode = logTimecode;
