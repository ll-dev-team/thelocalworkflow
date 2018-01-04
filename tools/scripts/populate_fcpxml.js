const Shoot = require('../../models/shoot');
const parseXml = require('xml2js').parseString;
const fs = require('fs');
const xml = require('xml');
const xml2js = require('xml2js');
const path = require('path');
const mongoose = require('mongoose');
const traverse = require('traverse');

require('dotenv').config();

var pathForJson = 'tools/tests/output/json/';
var db = mongoose.connection;

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
            console.log("saved result: " + newShoot.shootId);
            if (index==(allFiles.length-1)) {
              db.close();
            }
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

function simpleTraverse(o ) {
  for (i in o) {
      if (!!o[i] && typeof(o[i])=="object") {
          console.log(i, o[i])
          simpleTraverse(o[i] );
          if (Object.keys(o).includes("$")){
            console.log("\nfound a $ the hard way: " + this.key);
            o._attr=o.$;
            delete o.$;
          }
          if (Object.keys(o).includes("bookmark")) {
            console.log("found a bookmark and will delete it: " + o.bookmark);
            delete o.bookmark;
          }
      }
  }
}

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
      console.log("\n\n\ngetting at properties\n\n");
      console.log("trying for the resource clips: ");
      for (var i = 0; i < thisObj.fcpxml.resources[0].asset.length; i++) {
        console.log("Clip #" + (i + 1) + ":");
        console.log(thisObj.fcpxml.resources[0].asset[i].$.name);
      }
      simpleTraverse(thisObj);
      var shootObjectJson = JSON.stringify(thisObj, null, 4);
      var newShoot = new Shoot({shootId: thisShootId, shootIdRoot:thisShootIdRoot, fcpxmlAsObject:thisObj, fcpxml: theXmlString
          });
      fs.writeFileSync((pathForJson + newShoot.shootIdRoot + ".json"), shootObjectJson);
      newShoot.save((err)=> {
        if (err) {
          console.log(err);
          // db.close();
          db.close();
          return;
        }
        else {
          console.log("saved result: " + newShoot.shootId);
          db.close();
        }

      });
    });
  }
  else {
    console.log("hidden file: " + file);
  }
}

module.exports.fcpxmlFolderToDb = fcpxmlFolderToDb;
module.exports.fcpxmlFileToDb = fcpxmlFileToDb;
