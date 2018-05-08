// const parseXml = require('xml2js').parseString;
const fs = require('fs');
const xml = require('xml');
const xml2js = require('xml2js');
const ioRequest = require('../../models/io2s');
const Fcpxml = require('../../models/fcpxml');
const path = require('path');
// const parseXmlString = require('xml2js').parseString;
const parser = new xml2js.Parser({attrkey: "_attr"});
const builder = new xml2js.Builder({attrkey: "_attr"});
var mongoose = require('mongoose');



function io2s(segmentArray, sourceFcpxmlPath, pathForXml, pathForJson, title){
  var offset = 0;
  console.log("\n\n\n\n\n\n\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n\n\n\n\n\n\n\n\nstarting the io2s function");
  var theSegmentClips = [];
  var theSpineArray = [{"mc-clip": theSegmentClips}];
  var xmlData = fs.readFileSync(sourceFcpxmlPath, "utf-8");
  // console.log(xmlData);
  parser.parseString(xmlData, (err, data)=>{
    var jsonFolderPath = path.dirname(pathForXml);
    var wholeJsonPath = path.join (jsonFolderPath, "wholeJsonRef.json")
    fs.writeFileSync(wholeJsonPath, (JSON.stringify(data, null, 4)))
    // fs.writeFileSync(wholeJsonPath, (JSON.stringify(data.fcpxml, null, 4))) -- test file for checking out full json for fcpxml
    theMulticlips = [];
    // loop through all segments to find all MCs referened and push to theMulticlips
    segmentArray.forEach((segment)=>{
      // console.log(JSON.stringify(segment.shootId));
      var theMcName = (segment.shootId.split("_MC_")[0] + "_MC");
      if (!theMulticlips.includes(theMcName)) {
        theMulticlips.push(theMcName)
      }
    });
    var mcArray = [];
    console.log("the multiclips referenced are " + JSON.stringify(theMulticlips, null, 4));
    // find the Multiclips' r numbers
    theMulticlips.forEach((mc)=>{
      console.log("working on " + mc);
      for (var i = 0; i < data.fcpxml.resources[0].media.length; i++) {
        console.log("getting this from data.fcpxml.resources . . . " + data.fcpxml.resources[0].media[i]._attr.name);
        if (mc==data.fcpxml.resources[0].media[i]._attr.name) {
          mcArray.push({name: mc, rNumber: data.fcpxml.resources[0].media[i]._attr.id});
          console.log("pushing in " + mc + " and " + data.fcpxml.resources[0].media[i]._attr.id);
          break;
        }
      }
    })

    console.log(JSON.stringify(mcArray, null, 4));
    var theDate = new Date();
    fs.writeFileSync(pathForJson, JSON.stringify(data, null, 4));
    var shootIdRe = /([0-9]{8}_[0-9]{3})/
    segmentArray.forEach((segment, index)=>{
        if (shootIdRe.test(segment.shootId)) {
          console.log(index);
          console.log(JSON.stringify(segment, null, 4));
          console.log("we think that " + segment.shootId + " is actually a clip.");
          // console.log("testing " + segment.shootId);
          var thisFile = (segment.shootId.split("_MC_")[0] + "_MC");
          // console.log(thisFile);
          for (var i = 0; i < mcArray.length; i++) {
            // console.log("working on mcArray[" + i + "], which is r number " + mcArray[i].rNumber);
            // console.log("testing if " + mcArray[i].name + " is the same as " + thisFile);
            if (mcArray[i].name==thisFile) {
              var theR = mcArray[i].rNumber;
              // console.log("adding in this as the rNumber " + theR);
              break;
            }
          }

          //handle any leading 0s converted to strings by CSVtoJSON
          if (typeof segment.inFrame === 'string'){
            segment.inFrame = parseInt(segment.inFrame, 10)
            console.log('accessed the parseInt function');
          }
          if (typeof segment.inSec === 'string'){
            segment.inSec = parseInt(segment.inSec, 10)
          }
          if (typeof segment.inMin === 'string'){
            segment.inMin = parseInt(segment.inMin, 10)
          }
          if (typeof segment.inHr === 'string'){
            segment.inHr = parseInt(segment.inHr, 10)
          }
          if (typeof segment.outFrame === 'string'){
            segment.outFrame = parseInt(segment.outFrame, 10)
          }
          if (typeof segment.outSec === 'string'){
            segment.outSec = parseInt(segment.outSec, 10)
          }
          if (typeof segment.outMin === 'string'){
            segment.outMin = parseInt(segment.outMin, 10)
          }
          if (typeof segment.outHr === 'string'){
            segment.outHr = parseInt(segment.outHr, 10)
          }


          var inTcFcpxml = 1001*((segment.inFrame)+(24*(segment.inSec+(60*(segment.inMin+(60*segment.inHr))))));
          console.log("inTcFcpxml is " + inTcFcpxml);
          var outTcFcpxml = 1001*((segment.outFrame)+(24*(segment.outSec+(60*(segment.outMin+(60*segment.outHr))))));
          console.log("outTcFcpxml is " + outTcFcpxml);
          var camera = "";
          var audioAngleID = "";
          if (!segment.camAngle || segment.camAngle=="A") {
            camera = "0000C300a";
            //new check for angleIDs matching camera names -- this code is overly complicated, could just straight set camera to angleID, but I wanted to be able to log out when there's a discrepancy
            for (var i = 0; i < data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"].length; i++) {
              if (camera.substr(-5) == data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.name) {
                if (camera != data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.angleID) {
                  camera = data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.angleID
                  audioAngleID = data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.angleID
                  console.log("We've updated the angleIDs to match the fcpxml export.");
              }
            }
            };
          }
          else if (segment.camAngle=="B") {
            camera = "0000C300b";
            for (var i = 0; i < data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"].length; i++) {
              if (camera.substr(-5) == data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.name) {
                if (camera != data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.angleID) {
                  camera = data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.angleID
                  console.log("We've updated the angleIDs to match the fcpxml export.");
              }
            }
            };
          }
          else if (segment.camAngle=="C") {
            camera = "0000C300c";
            for (var i = 0; i < data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"].length; i++) {
              if (camera.substr(-5) == data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.name) {
                if (camera != data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.angleID) {
                  camera = data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.angleID
                  console.log("We've updated the angleIDs to match the fcpxml export.");
              }
            }
            };
          }
          else if (segment.camAngle=="D") {
            camera = "0000GH4";
            for (var i = 0; i < data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"].length; i++) {
              if (camera.substr(-3) == data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.name) {
                if (camera != data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.angleID) {
                  camera = data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.angleID
                  console.log("We've updated the angleIDs to match the fcpxml export.");

              }
            }
            };
          }
          else {
            camera = "0000C300a";
            for (var i = 0; i < data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"].length; i++) {
              if (camera.substr(-5) == data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.name) {
                if (camera != data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.angleID) {
                  camera = data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.angleID
              }
            }
            };
          }
          //updates audio angleID if video is not C300a
          if (!audioAngleID) {
            for (var i = 0; i < data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"].length; i++) {
              if ('C300a' == data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.name) {
                  audioAngleID = data.fcpxml.resources[0].media[0].multicam[0]["mc-angle"][i]._attr.angleID
              }
            };
          }
          // console.log("camera is " + camera);
          var duration = (outTcFcpxml - inTcFcpxml)+1001;
          // console.log("duration is " + duration);
          var thisClipXML = {_attr:{
                                name: thisFile,
                                offset:fcpxmlFormat(offset),
                                ref:theR,
                                duration:fcpxmlFormat(duration),
                                start:fcpxmlFormat(inTcFcpxml)
                              },
                            "mc-source":[
                                {_attr:{
                                  angleID: audioAngleID,
                                  srcEnable:"audio"}
                                },
                                {_attr:{
                                  angleID: camera,
                                  srcEnable:"video"}
                                }
                              ]
                            };

        }
        else if (!shootIdRe.test(segment.shootId)) {
          var duration = 72072;
          console.log(index);
          console.log("tried negative test and this isn't a match " + segment.shootId);
          var thisClipXML = {"gap": //do something here?
              [
                {_attr:
                  {name: "Gap", offset:fcpxmlFormat(offset), duration:fcpxmlFormat(duration), start:"86400314/24000s"}
                }

              ]
            };

        }

        theSegmentClips.push(thisClipXML);

        offset = offset + duration;
      });
          console.log("the final offset is " + offset);
          var segmentDuration = tc_from_frames((offset/1001)).tc_string;
          console.log("the segment is " + segmentDuration + " long.");
          var postTs = new Date().getTime();
          var theEventObject = {_attr:
                                  {name: "Projects"},
                                project:[
                                  {
                                    _attr: {name: title},
                                    sequence:
                                    [{
                                      _attr: {duration: fcpxmlFormat(offset), format: data.fcpxml.resources[0].format[0]._attr.id, tcStart:"0s", tcFormat:"0s", tcFormat: "NDF", audioLayout:"stereo", audioRate:"48k"},
                                      //removed hard coded r# for format; also removed colorspace parameter
                                      spine: theSpineArray

                                    }]
                                    }
                                  ]
                                };

          var theXml = builder.buildObject(theEventObject); //need to change header on this object for building v. pushing
                var newIoProject = new ioRequest({fcpxml: theXml, submissionTs: postTs});
                newIoProject.save((err)=> {
                  // console.log("saved result:\n" + JSON.stringify(newIoProject, null, 5));
              mongoose.connection.close();
            });
      // console.log(theXml);
      fs.writeFileSync(pathForXml, theXml);
      console.log("done");

      data.fcpxml.library[0].event.push(theEventObject);
      console.log(JSON.stringify(data, null, 4));
      var newXml = builder.buildObject(data, true);
      var io2sInsertPath = path.join (jsonFolderPath, "io2sInsert_test.fcpxml")
      fs.writeFileSync(io2sInsertPath, newXml);
      var newJsonPath = path.join (jsonFolderPath, "newJson.json")
      fs.writeFileSync(newJsonPath, JSON.stringify(data, null, 4));


  });
}

function fcpxmlFormat(number){
  return (number + "/24000s");
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
// module.exports.singleIo2s = singleIo2s;
