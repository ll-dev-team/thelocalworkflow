const Shoot = require('../../models/shoot');
const parseXml = require('xml2js').parseString;
const fs = require('fs');
const xml = require('xml');
const xml2js = require('xml2js');
const path = require('path');

require('dotenv').config();

var pathForJson = 'tools/tests/output/json/'

function fcpxmlFolderToDb (folderPath) {
  var allFiles = fs.readdirSync(folderPath);
  var reDot = /^\./
  var reFcpxml = /fcpxml$/
  allFiles.forEach((file, index)=>{
    if (reFcpxml.test(file)) {
      console.log("this looks like a fcpxml file: " + file);
      var theXmlString = fs.readFileSync(path.join(folderPath, file), "utf-8");
      var thisShootId = (file.split('_')[0] + "_" + file.split('_')[1] + "_" + file.split('_')[2] + "_" + file.split('_')[3]);
      var thisShootIdRoot = (file.split('_')[0] + "_" + file.split('_')[1]);
      parseXml(theXmlString, (err, thisObj)=>{
        if (err) {
          console.log(err);
        }
        // console.log("here is the json from xml: \n" + JSON.stringify(thisObj, null, 4));
        var newShoot = new Shoot({shootId: thisShootId, shootIdRoot:thisShootIdRoot, fcpxml: theXmlString
            // , fcpxmlAsJson:thisObj
            });
        newShoot.save((err)=> {
          if (err) {
            console.log(err);
            return;
          }
          else {
            console.log("saved result:\n")
          }

        });
        console.log("\n\n\ngetting at properties\n\n");
        console.log("trying for the resource clips: ");
        for (var i = 0; i < thisObj.fcpxml.resources[0].asset.length; i++) {
          console.log("Clip #" + (i + 1) + ":");
          console.log(thisObj.fcpxml.resources[0].asset[i].$.name);
        }
        var shootObjectJson = JSON.stringify(thisObj, null, 4);
        fs.writeFileSync((pathForJson + newShoot.shootIdRoot + ".json"), shootObjectJson);
      });
    }
    else {
      console.log("hidden file: " + file);
    }

  });
};

function fcpxmlFileToDb (filePath) {
  console.log("in the file function and would execute it on " + filePath);
  var reDot = /^\./
  var reFcpxml = /fcpxml$/
  if (reFcpxml.test(filePath)) {
    var file = path.basename(filePath);
    console.log("this looks like a fcpxml file: " + file);
    var theXmlString = fs.readFileSync(filePath, "utf-8");
    var thisShootId = (file.split('_')[0] + "_" + file.split('_')[1] + "_" + file.split('_')[2] + "_" + file.split('_')[3]);
    var thisShootIdRoot = (file.split('_')[0] + "_" + file.split('_')[1]);
    parseXml(theXmlString, (err, thisObj)=>{
      if (err) {
        console.log(err);
      }
      var newShoot = new Shoot({shootId: thisShootId, shootIdRoot:thisShootIdRoot, fcpxml: theXmlString
          // , fcpxmlAsJson:thisObj
          });

      // newShoot.save((err)=> {
      //   if (err) {
      //     console.log(err);
      //     return;
      //   }
      //   else {
      //     console.log("saved result:\n")
      //   }
      //
      // });

      console.log("\n\n\ngetting at properties\n\n");
      console.log("trying for the resource clips: ");
      for (var i = 0; i < thisObj.fcpxml.resources[0].asset.length; i++) {
        console.log("Clip #" + (i + 1) + ":");
        console.log(thisObj.fcpxml.resources[0].asset[i].$.name);
      }
      var shootObjectJson = JSON.stringify(thisObj, null, 4);
      fs.writeFileSync((pathForJson + newShoot.shootIdRoot + ".json"), shootObjectJson);
      console.log("these are the object's keys: " + Object.keys(thisObj));
    });
  }
  else {
    console.log("hidden file: " + file);
  }
}

module.exports.fcpxmlFolderToDb = fcpxmlFolderToDb;
module.exports.fcpxmlFileToDb = fcpxmlFileToDb;
