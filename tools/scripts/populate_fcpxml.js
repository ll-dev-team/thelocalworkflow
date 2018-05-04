const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const traverse = require('traverse');
require('dotenv').config();
var pathForJson = 'tools/tests/output/json/';
var Fcpxml = require('../../models/fcpxml');
var parser = new xml2js.Parser({attrkey: "_attr"});
const mongoose = require('mongoose');

function fcpxmlFolderToDb (folderPath) {
    console.log("mongoDB url is " + process.env.MONGODB_URL);
    var allFiles = fs.readdirSync(folderPath);
    var reDot = /^\./
    var reFcpxml = /fcpxml$/
    var theFcpxmls = [];
    console.log(allFiles.length);
    allFiles.forEach((file, index)=>{
      if (reFcpxml.test(file)) {
        console.log("this looks like a fcpxml file: " + file);
        var fileNoExt = file.split('.')[0];
        var theXmlString = fs.readFileSync(path.join(folderPath, file), "utf-8");
        parser.parseString(theXmlString, (err, thisObj)=>{
          if (err) {
            console.log(err);
            console.log("there was an error saving");
          }
          else {
            // var thisShootId = thisObj.fcpxml.library[0].event.
            var thisShootId = (fileNoExt.split('_')[0] + "_" + fileNoExt.split('_')[1] + "_" + fileNoExt.split('_')[2] + "_" + fileNoExt.split('_')[3]);
            var thisShootIdRoot = (thisShootId.split('_')[0] + "_" + thisShootId.split('_')[1]);
            var thisObjJson = JSON.stringify(thisObj, null, 4);
            var theDate = new Date();
            var newFcpxml = {
              shootId: thisShootId,
              shootIdRoot:thisShootIdRoot,
              fcpxml: theXmlString,
              fcpxmlObj:thisObj,
              fcpxmlJson:thisObjJson,
              ts: theDate.getTime()
            };
            console.log(theDate.getTime());
            theFcpxmls.push(newFcpxml);
            testFcpxmlObj(newFcpxml);
            fs.writeFileSync((pathForJson + newFcpxml.shootId + ".json"), newFcpxml.fcpxmlJson);
          }
        });
      }
      else {
        console.log("hidden file: " + file);
      }
    });
    toMongo(theFcpxmls);
  };

function simpleTraverse(o) {
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
    console.log("but we need to refactor this");
    if (reFcpxml.test(file)) {
      console.log("this looks like a fcpxml file: " + file);
      var fileNoExt = file.split('.')[0];
      var theXmlString = fs.readFileSync(path.join(folderPath, file), "utf-8");
      parser.parseString(theXmlString, (err, thisObj)=>{
        if (err) {
          console.log(err);
          console.log("there was an error saving");
        }
        else {
          // var thisShootId = thisObj.fcpxml.library[0].event.
          var thisShootId = (fileNoExt.split('_')[0] + "_" + fileNoExt.split('_')[1] + "_" + fileNoExt.split('_')[2] + "_" + fileNoExt.split('_')[3]);
          var thisShootIdRoot = (thisShootId.split('_')[0] + "_" + thisShootId.split('_')[1]);
          var thisObjJson = JSON.stringify(thisObj, null, 4);
          var theDate = new Date();
          var newFcpxml = {
            shootId: thisShootId,
            shootIdRoot:thisShootIdRoot,
            fcpxml: theXmlString,
            fcpxmlObj:thisObj,
            fcpxmlJson:thisObjJson,
            ts: theDate.getTime()
          };
          console.log(theDate.getTime());
          theFcpxmls.push(newFcpxml);
          testFcpxmlObj(newFcpxml);
          fs.writeFileSync((pathForJson + newFcpxml.shootId + ".json"), newFcpxml.fcpxmlJson);
          mongoose.connect(process.env.MONGODB_URL);
          var aNewFcpxml = new Fcpxml({
                shootId : theFcpxml.shootId,
                shootIdRoot: theFcpxml.shootIdRoot,
                fcpxml : theFcpxml.fcpxml,
                fcpxmlObj: theFcpxml.fcpxmlObj,
                fcpxmlAsJson: theFcpxml.fcpxmlJson,
                ts: theFcpxml.ts
          });
          console.log(JSON.stringify(aNewFcpxml, null, 4));
          aNewFcpxml.save(function(err){
                    if (err) { console.log("there was an error");
                    // return next(err);
                    }
                    else {
                      console.log("saved fcpxml");
                      mongoose.connection.close();
                    }
          });
        }
      });
    }
    else {
      console.log("hidden file: " + file);
    }
}

function testFcpxmlObj(anFcpxml){
  var fcpxmlObj = JSON.parse(anFcpxml.fcpxmlJson);
  // console.log(JSON.stringify(fcpxmlObj, null, 4));
  console.log("\n\n\ngetting at properties\n\n");
  console.log("trying for the resource clips: ");
  for (var i = 0; i < fcpxmlObj.fcpxml.resources[0].asset.length; i++) {
    console.log("Clip #" + (i + 1) + ":");
    console.log(fcpxmlObj.fcpxml.resources[0].asset[i]._attr.name);
  }
}

function toMongo(fcpxmlArray){
  mongoose.connect(process.env.MONGODB_URL);
  fcpxmlArray.forEach((theFcpxml, index)=>{
    console.log("trying to save");
    var aNewFcpxml = new Fcpxml({
          shootId : theFcpxml.shootId,
          shootIdRoot: theFcpxml.shootIdRoot,
          fcpxml : theFcpxml.fcpxml,
          fcpxmlObj: theFcpxml.fcpxmlObj,
          fcpxmlAsJson: theFcpxml.fcpxmlJson,
          ts: theFcpxml.ts
    });
    console.log(JSON.stringify(aNewFcpxml, null, 4));
    aNewFcpxml.save(function(err){
              if (err) { console.log("there was an error");
              // return next(err);
              }
              else {
                console.log("saved fcpxml");
                if ((index+1)==fcpxmlArray.length) {
                    mongoose.connection.close();
                }
              }
    });
  })
}

module.exports.fcpxmlFolderToDb = fcpxmlFolderToDb;
module.exports.fcpxmlFileToDb = fcpxmlFileToDb;
