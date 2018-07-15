var fs = require("fs");
var path = require("path");
var ffprobeSync = require("../../tools/workflow_tools/ffprobetools").ffprobeSync;
var moment = require('moment');
var colors = require('colors/safe');
var Clip = require('../../models/clip');
const {promisify} = require('util');
const statAsync = promisify(fs.stat);

function replaceDots(obj){
  console.log("starting replace dots");
  for (var k in obj){
    console.log("testing " + k);
    if (!obj.hasOwnProperty(k)){
          console.log("not a property, really");
          continue
        }
    if (k.includes('.')){
      var newPropName = k.replace(/\./g,'_');
      obj[newPropName] = obj[k];
      delete obj[k];
    }
    if (typeof obj[k] == "object" && obj[k] !== null){
      replaceDots(obj[k]);
    }
    else {
    }
  }
}

exports.ffprobe_get = function(req, res, next) {
    res.render('tools/ffprobe', { title: 'Probe Something', tabTitle: "FFprobe", errors: null});
};

exports.ffprobe_post = function(req, res, next) {
  console.log(JSON.stringify(req.body, null, 4));
    req.checkBody('filepath', 'file path must be a valid path').notEmpty().isAscii();
    req.sanitize('filepath').trim();
    var errors = req.validationErrors();
    var theLlId = path.basename(req.body.filepath, (path.extname(req.body.filepath)));
    console.log("the LL id is " + theLlId);
    getAllData(req.body.filepath)
      // .then(data=>{
      //   console.log("\n\nabout to create new object\n\n");
      //   replaceDots(data.ffprobeData);
      //   var newClip = new Clip({
      //     ll_id:theLlId,
      //     filename:(path.basename(req.body.filepath)),
      //     statData:data.statData,
      //     ffprobeData:data.ffprobeData
      //   });
      //   newClip.save(function(err){if (err) {
      //     console.log(err);
      //   } else {console.log("saved ok");}});
      //   return {filename:(path.basename(req.body.filepath)), statData:data.statData, ffprobeData:data.ffprobeData};
      // })
      .then(data=>res.render("tools/results", {title: "results", tabTitle: "results", results: JSON.stringify(data, null, 4), errors: errors}))
      // .then(data=>{res.send("got it")})
      .catch(err=>{console.log("there was an error\n\n" + err + "\n\n")});
};

async function getAllData(path){
  console.log("getting all the data");
  let allData = {};
  allData.statData = await statAsync(path);
  allData.ffprobeData = await JSON.parse(ffprobeSync(path));
  return allData;
};
