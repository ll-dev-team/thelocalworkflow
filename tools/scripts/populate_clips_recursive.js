const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
var ffprobeSync = require("../workflow_tools/ffprobetools").ffprobeSync;
var moment = require('moment');
var colors = require('colors/safe');
const {promisify} = require('util');
const statAsync = promisify(fs.stat);
var Clip = require('../../models/clip');
var Test = require('../../models/test');


var reDot = /^\./
var videoFileExtensions = /(\.mov|\.MOV|\.m4v|\.mp4)$/i;


async function loop() {
  for (let i = 0; i < 10; i++) {
      await new Promise((resolve, reject) => {

        // setTimeout(resolve, Math.random() * 1000)
        var ts = moment().valueOf();
        var aTest = new Test({name:("test "+ i), timestamp: ts});
        aTest.save(function(err){
          if (err) {
            console.log(err);
            reject();
          }
          else {
            console.log("saved your data " + i + " at " + ts);
            console.log("Starting innerLoop");
            innerLoop(i, resolve);
            console.log("Done innerLoop");
            // resolve("saved your data");
          }
        })
      });
      console.log(i);
  }
}

async function innerLoop(index, cb) {
  console.log("starting inner loop inside function");
  for (let j = 0; j < 10; j++) {
      await new Promise((resolve, reject) => {
        // setTimeout(resolve, Math.random() * 1000)
        var ts = moment().valueOf();
        var bTest = new Test({name:("test "+ j), timestamp: ts});
        bTest.save(function(err){
          if (err) {
            console.log(err);
            reject();
          }
          else {
            console.log("saved your data " + j + " at " + ts + "in outerloop " + index);
            resolve("saved your data");
          }
        })
      });
      console.log(j);
  }
  console.log("at end of inner loop code");
  cb();
}

async function populateClips(folderPath){

  mongoose.Promise = global.Promise;
  var mongoDB = process.env.MONGODB_URL;
  console.log("mongoDB url is " + mongoDB);
  mongoose.connect(mongoDB);
  var db = mongoose.connection;
  console.log("starting outer loop");
  await loop();
  console.log("done outer loop");
  db.close();
}

function pGetAllData(filepath){
  return new Promise((resolve, reject)=>{
    console.log("starting getAllData on " + filepath);
    var ts = moment().valueOf();
    let allData = {};
    allData.filename = path.basename(filepath)
    allData.ll_id = path.basename(filepath, (path.extname(filepath)));
    allData.statData = statAsync(filepath);
    var tempFfprobeData = JSON.parse(ffprobeSync(filepath));
    allData.ffprobeData = replaceDots(tempFfprobeData);
    allData.pathHistory = [{path:filepath, ts: ts}];
    console.log(colors.blue(JSON.stringify(allData)));
    resolve(allData);
  })
}

function replaceDots(obj){
  console.log("starting replace dots");
  for (var p in obj){
    console.log("testing " + p);
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

module.exports.populateClips = populateClips;
