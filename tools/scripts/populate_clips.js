const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('dotenv').config();
var mongoDB = process.env.MONGODB_URL;
var ffprobeSync = require("../workflow_tools/ffprobetools").ffprobeSync;
var moment = require('moment');
var colors = require('colors/safe');
const {promisify} = require('util');
const statAsync = promisify(fs.stat);
var Clip = require('../../models/clip');
var Test = require('../../models/test');
var reDot = /^\./
var videoFileExtensions = /(\.mov|\.MOV|\.m4v|\.mp4)$/i;

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function replaceDots(obj){
  console.log("starting replace dots");
  for (var p in obj){
    // console.log("testing " + p);
    if (!obj.hasOwnProperty(p)){
          console.log("not a property, really");
          continue
        }
    if (p.includes('.')){
      var newPropName = p.replace(/\./g,'_');
      obj[newPropName] = obj[p];
      delete obj[p];
    }
    if (typeof obj[p] == "object" && obj[p] !== null){
      replaceDots(obj[p]);
    }
    else {
    }
  }
  // console.log(colors.magenta(JSON.stringify(obj)));
  return obj;
}

async function getAllData(filepath){
  console.log("starting getAllData on " + filepath);
  var ts = moment().valueOf();
  let allData = {};
  allData.filename = path.basename(filepath)
  allData.ll_id = path.basename(filepath, (path.extname(filepath)));
  allData.statData = await statAsync(filepath);
  var tempFfprobeData = JSON.parse(ffprobeSync(filepath));
  allData.ffprobeData = replaceDots(tempFfprobeData);
  allData.pathHistory = [{path:filepath, ts: ts}];
  // console.log(JSON.stringify(allData));
  return allData;
};

async function populateClips(folderPath){
  mongoose.Promise = global.Promise;
  var mongoDB = process.env.MONGODB_URL;
  console.log("mongoDB url is " + mongoDB);
  mongoose.connect(mongoDB);
  var db = mongoose.connection;
  console.log(colors.red("starting on outerloop with" + folderPath));
  await loopOuterFolder(folderPath);
  console.log("done outer loop");
  db.close();
}


async function loopOuterFolder(folderPath) {
  console.log("starting loopOuterFolder");
  var shootFolders = fs.readdirSync(folderPath);
  console.log("shootFolders=" + shootFolders);
  for (let i = 0; i < shootFolders.length; i++) {
      await new Promise((resolve, reject) => {
        console.log(i);
        var shootFolderPath = path.join(folderPath, shootFolders[i]);
        if (!reDot.test(shootFolders[i]) && fs.statSync(shootFolderPath).isDirectory()){
          var ts = moment().valueOf();
          var aTest = new Test({name:("shootFolder " + shootFolders[i]), timestamp: ts});
          aTest.save(function(err){
            if (err) {
              console.log(err);
              reject();
            }
            else {
              console.log("saved your data " + i + " at " + ts);
              console.log("Starting loopShootFolder");
              loopShootFolder(shootFolderPath, resolve);
              console.log("Done loopShootFolder");
              // resolve("saved your data");
            }
          })
        }
        else {
          console.log(shootFolderPath + " isn't a shootFolder.");
          resolve();
        }
      });
      console.log(i);
  }
}

async function loopShootFolder(shootFolder, cb) {
  console.log("starting loopShootFolder inside function for " + shootFolder);
  var cameraFolders = fs.readdirSync(shootFolder);
  for (let j = 0; j < cameraFolders.length; j++) {
      await new Promise((resolve, reject) => {
        // setTimeout(resolve, Math.random() * 1000)
        var ts = moment().valueOf();
        var cameraFolderPath = path.join(shootFolder, cameraFolders[j]);
        if (reDot.test(cameraFolders[j])) {
          console.log("hidden file: " + cameraFolderPath);
          resolve();
        }
        if (!fs.statSync(cameraFolderPath).isDirectory()) {
          console.log("not a directory: " + cameraFolderPath);
          resolve();
        }
        else {
          loopCameraFolder(cameraFolderPath, resolve);
        }
      });
      console.log(j);
  }
  console.log("at end of loopShootFolder code for " + shootFolder);
  cb();
}




async function loopCameraFolder(cameraFolder, cb) {
  console.log("starting loopCameraFolder inside function for " + cameraFolder);
  var files = fs.readdirSync(cameraFolder);
  console.log("found these files:" + files);
  for (let k = 0; k < files.length; k++) {
      await new Promise((resolve, reject) => {
        // setTimeout(resolve, Math.random() * 1000)
        var ts = moment().valueOf();
        if (videoFileExtensions.test(files[k])) {
          var filePath = path.join(cameraFolder, files[k]);
          console.log("video file: " + filePath);
          sendToMongoRevised(filePath, resolve);
        }
        else {
          console.log("not a video file: " + files[k]);
          resolve();
        }
      });
      console.log(k);
  }
  console.log("at end of loopCameraFolder code for " + cameraFolder);
  cb();
  console.log('Done')
}

async function sendToMongoRevised(file, cb){
  var allData = await getAllData(file);
  // console.log(colors.magenta(JSON.stringify(allData, null, 4)));
  var newClip = new Clip(allData);
  Clip.count({ll_id: newClip.ll_id}, function (err, count){
    if(count>0){
        console.log("clip " + newClip.ll_id + " is already in the db");
        cb();
    }
    else {
      newClip.save(function(err){
        if (err) {
          console.log("there was an error trying to save " + newClip.filename);
        }
        else {
          console.log("saved " + newClip.ll_id + " to the db");
          cb();
        }
      });
    }
  });
}

module.exports.populateClips = populateClips;
