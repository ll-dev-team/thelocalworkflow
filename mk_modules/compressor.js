const xml = require('xml');
const fs = require("fs");
const columnify = require('columnify');
const path = require("path");
const ffprobetools = require("./ffprobetools");
const shootprocessor = require("./shootprocessor");
const dateFormat = require('dateformat');
const cp = require('child_process');

var now = new Date();

function transcodeSync(folderPath) {
  var re = /^\./;
  var folders = fs.readdirSync(folderPath);
  folders.forEach(function(folder){
    console.log("testing " + folder);
    if (fs.statSync(path.join(folderPath,folder)).isDirectory()){
      console.log(folder + " is a directory");
      var files = fs.readdirSync(path.join(folderPath,folder));
      files.forEach(function(file,index){
        if (re.test(file)) {
          console.log(file + " is a hidden file. DO NOT COMPRESS.");
        }
        else {
          console.log("working on file #" + index);
          console.log(file);
          var theFilePath = path.join(folderPath,folder,file);
          var output = cp.spawnSync('/Applications/Compressor.app/Contents/MacOS/Compressor', ['-jobpath', theFilePath, '-settingpath',  '/Users/mk/Library/Application\ Support/Compressor/Settings/1080_h264.cmprstng', '-locationpath', path.join(folderPath,folder,file, "_h264.mov")]);
          console.log("done file #" + index);
        }

      });
    }
  })};
//
// function transcodeAsync(folderPath) {
//   var re = /^\./;
//   var folders = fs.readdirSync(folderPath);
//   folders.forEach(function(folder){
//     console.log("testing " + folder);
//     if (fs.statSync(path.join(folderPath,folder)).isDirectory()){
//       console.log(folder + " is a directory");
//       var files = fs.readdirSync(path.join(folderPath,folder));
//       files.forEach(function(file,index){
//         if (re.test(file)) {
//           console.log(file + " is a hidden file. DO NOT COMPRESS.");
//         }
//         else {
//           console.log("working on file #" + index);
//           console.log(file);
//           var theFilePath = path.join(folderPath,folder,file);
//           var output = cp.spawnSync('/Applications/Compressor.app/Contents/MacOS/Compressor', ['-jobpath', theFilePath, '-settingpath',  '/Users/mk/Library/Application\ Support/Compressor/Settings/1080_h264.cmprstng', '-locationpath', ('/Users/mk/Development/test_materials/exports/proxy/'+ file + "_h264.mov")]);
//           console.log("done file #" + index);
//         }
//
//       });
//     }
//   })};

// module.exports.transcodeAsync = transcodeAsync;
module.exports.transcodeSync = transcodeSync;
