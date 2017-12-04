const parseXml = require('xml2js').parseString;
const fs = require('fs');
const xml = require('xml');
const xml2js = require('xml2js');
// require shootprocessor?
// loop through all



function io2s(ioJson, xmlPath){
  // console.log(xml);
  var builder = new xml2js.Builder();
  fs.readFile(xmlPath, (err, result)=>{
    parseXml(result, (err, theJs)=>{
      // console.log(ioJson);
      console.log(JSON.stringify(theJs, null, 4));
      ioJson.forEach((segment)=>{
        console.log("first segment in point is " + segment.inHr + ":" + segment.inMin + ":" + segment.inSec + ":" + segment.inFrame);
      });
      theXmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n'
      // var theXml = xml(theJs, {indent:'\t'});
      // var theXml = xml(theJs)
      var theXml = builder.buildObject(theJs);
      console.log(theXml);
    });
  });
}

module.exports.io2s = io2s;
