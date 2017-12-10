const parseXml = require('xml2js').parseString;
const fs = require('fs');
const xml = require('xml');
const xml2js = require('xml2js');
const tools = require('../../ll_modules/workflowobjects').tools;
// require shootprocessor?
// loop through all



function io2s(ioJson, xmlPath){
  // console.log(xml);
  var builder = new xml2js.Builder();
  fs.readFile(xmlPath, (err, result)=>{
    parseXml(result, (err, theJs)=>{
      // console.log(ioJson);
      var offset = 0;
      console.log(JSON.stringify(theJs, null, 4));
      ioJson.forEach((segment)=>{
        console.log("now the offset is " + offset);
        console.log("first segment in point is " + segment.inHr + ":" + segment.inMin + ":" + segment.inSec + ":" + segment.inFrame);
        var inTcFcpxml = 1001*((segment.inFrame)+(24*(segment.inSec+(60*(segment.inMin+(60*segment.inHr))))));
        console.log("inTcFcpxml is " + inTcFcpxml);
        var outTcFcpxml = 1001*((segment.outFrame)+(24*(segment.outSec+(60*(segment.outMin+(60*segment.outHr))))));
        console.log("outTcFcpxml is " + outTcFcpxml);
        var camera = segment.camAngle;
        console.log("camera is " + camera);
        var duration = outTcFcpxml - inTcFcpxml;
        console.log("duration is " + duration);
        offset = offset + duration;
      });
      console.log("the final offset is " + offset);
      var segmentDuration = tc_from_frames((offset/1001)).tc_string;
      console.log("the segment is " + segmentDuration + " long.");

      // theXmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n'
      // // var theXml = xml(theJs, {indent:'\t'});
      // // var theXml = xml(theJs)
      // var theXml = builder.buildObject(theJs);
      // console.log(theXml);
    });
  });
}

function tc_from_frames(frames){
  var the_frames=(frames % 24);
  var seconds = (frames-the_frames)/24;
  var the_seconds=(seconds%60);
  var minutes = (seconds-the_seconds)/60;
  var the_minutes = minutes%60;
  var the_hours = (minutes-the_minutes)/60;
  var theTc_string = ((("00" + the_hours).slice(-2))+(("00" + the_minutes).slice(-2))+(("00" + the_seconds).slice(-2))+(("00" + the_frames).slice(-2)));
  var theTc_colon_string = ((("00" + the_hours).slice(-2))+ ":" + (("00" + the_minutes).slice(-2))+ ":" + (("00" + the_seconds).slice(-2))+ ":" + (("00" + the_frames).slice(-2)));
  return {tc_forFilename: theTc_string, tc_string:theTc_colon_string};
};


module.exports.io2s = io2s;
