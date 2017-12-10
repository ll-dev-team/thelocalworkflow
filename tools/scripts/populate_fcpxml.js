const Fcpxml = require('../../models/fcpxml');
const Shoot = require('../../models/shoot');
const parseXml = require('xml2js').parseString;
const fs = require('fs');
const xml = require('xml');
const xml2js = require('xml2js');
const path = require('path');

require('dotenv').config();

var pathForJson = '/Volumes/mk2/_test_materials/test_output/test.json'


function fcpxmlToDb (folderPath) {
  var allFiles = fs.readdirSync(folderPath);
  var reDot = /^\./
  var reFcpxml = /fcpxml$/
  allFiles.forEach((file)=>{
    if (reFcpxml.test(file)) {
      console.log("this looks like a fcpxml file: " + file);
      var theXmlString = fs.readFileSync(path.join(folderPath, file), "utf-8");
      var shootId = (file.split('_')[0] + "_" + file.split('_')[1] + "_" + file.split('_')[2] + "_" + file.split('_')[3]);
      parseXml(theXmlString, (err, thisObj)=>{
        if (err) {
          console.log(err);
        }
        // console.log("here is the json from xml: \n" + JSON.stringify(thisObj, null, 4));
        var newFcpxml = new Fcpxml({shootId: shootId, fcpxml: theXmlString });
        newFcpxml.save((err)=> {
          // console.log("saved result:\n")
        });
        console.log("\n\n\ngetting at properties\n\n");
        console.log("trying for the resource clips: ");
        for (var i = 0; i < thisObj.fcpxml.resources[0].asset.length; i++) {
          console.log("Clip #" + (i + 1) + ":");
          console.log(thisObj.fcpxml.resources[0].asset[i].$.name);
        }
        var newShoot = new Shoot({shootId: shootId, })
        var shootObjectJson = JSON.stringify(thisObj, null, 4);
        fs.writeFileSync(pathForJson, shootObjectJson);
      });
    }
    else {
      console.log("hidden file: " + file);
    }

  });
};



module.exports = fcpxmlToDb;
