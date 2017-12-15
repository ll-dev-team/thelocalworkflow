const parseXml = require('xml2js').parseString;
const fs = require('fs');
const xml = require('xml');
const xml2js = require('xml2js');
const ioRequest = require('../../models/io2s');
const Fcpxml = require('../../models/fcpxml');
const path = require('path');
const parseXmlString = require('xml2js').parseString;
var mongoose = require('mongoose');

// require shootprocessor?
// loop through all


function io2s(segmentArray, sourceFcpxmlPath, pathForXml, pathForJson, title){
  var offset = 0;
  console.log("\n\n\n\n\n\n\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n\n\n\n\n\n\n\n\nstarting the io2s function");
  var theSpineArray = [];
  var xmlData = fs.readFileSync(sourceFcpxmlPath, "utf-8");
  // console.log(xmlData);
  parseXmlString(xmlData, (err, data)=>{
    var jsonFolderPath = path.dirname(pathForXml);
    var wholeJsonPath = path.join (jsonFolderPath, "wholeJsonRef.json")
    fs.writeFileSync(wholeJsonPath, (JSON.stringify(data.fcpxml.library[0].event, null, 4)))
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
        console.log("getting this from data.fcpxml.resources . . . " + data.fcpxml.resources[0].media[i].$.name);
        if (mc==data.fcpxml.resources[0].media[i].$.name) {
          mcArray.push({name: mc, rNumber: data.fcpxml.resources[0].media[i].$.id});
          console.log("pushing in " + mc + " and " + data.fcpxml.resources[0].media[i].$.id);
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
          var inTcFcpxml = 1001*((segment.inFrame)+(24*(segment.inSec+(60*(segment.inMin+(60*segment.inHr))))));
          // console.log("inTcFcpxml is " + inTcFcpxml);
          var outTcFcpxml = 1001*((segment.outFrame)+(24*(segment.outSec+(60*(segment.outMin+(60*segment.outHr))))));
          // console.log("outTcFcpxml is " + outTcFcpxml);
          var camera = "";
          if (!segment.camAngle || segment.camAngle=="A") {
            camera = "0000C300a";
          }
          else if (segment.camAngle=="B") {
            camera = "0000C300b";
          }
          else if (segment.camAngle=="C") {
            camera = "0000C300c";
          }
          else if (segment.camAngle=="D") {
            camera = "0000GH4";
          }
          else {
            camera = "0000C300a";
          }
          // console.log("camera is " + camera);
          var duration = (outTcFcpxml - inTcFcpxml)+1001;
          // console.log("duration is " + duration);
          var thisClipXML = {"mc-clip":
              [
                {_attr:
                  {name: thisFile, offset:fcpxmlFormat(offset), ref:theR, duration:fcpxmlFormat(duration), start:fcpxmlFormat(inTcFcpxml)}
                },
                {"mc-source":
                  {_attr:{angleID: "0000C300a", srcEnable:"audio"}}
                },
                {"mc-source": {_attr:{angleID: camera, srcEnable:"video"}}
                }
              ]
            };
            var thisClipXML2 = {"mc-clip":
                [
                  {$:
                    {name: thisFile, offset:fcpxmlFormat(offset), ref:theR, duration:fcpxmlFormat(duration), start:fcpxmlFormat(inTcFcpxml)}
                  },
                  {"mc-source":
                    {_attr:{angleID: "0000C300a", srcEnable:"audio"}}
                  },
                  {"mc-source": {_attr:{angleID: camera, srcEnable:"video"}}
                  }
                ]
              };

        }
        else if (!shootIdRe.test(segment.shootId)) {
          var duration = 72072;
          console.log(index);
          console.log("tried negative test and this isn't a match " + segment.shootId);
          var thisClipXML = {"gap":
              [
                {_attr:
                  {name: "Gap", offset:fcpxmlFormat(offset), duration:fcpxmlFormat(duration), start:"86400314/24000s"}
                }

              ]
            };
          var thisClipXML2 = {"gap":
              [
                {$:
                  {name: "Gap", offset:fcpxmlFormat(offset), duration:fcpxmlFormat(duration), start:"86400314/24000s"}
                }

              ]
            };
        }

        theSpineArray.push(thisClipXML);

        offset = offset + duration;
      });
          console.log("the final offset is " + offset);
          var segmentDuration = tc_from_frames((offset/1001)).tc_string;
          console.log("the segment is " + segmentDuration + " long.");
          var postTs = new Date().getTime();
          var theEventObject = {event:
            [
              {_attr: {name: "Projects"}},
              {project:
                [
                  {_attr: {name: title}},
                  {sequence:
                    [
                      {_attr:
                        {duration: fcpxmlFormat(offset), format: 'r1', renderColorSpace:"Rec. 709", tcStart:"0s", tcFormat:"0s", tcFormat: "NDF", audioLayout:"stereo", audioRate:"48k"}},
                      {spine: theSpineArray}
                    ]
                  }
                ]
              }
            ]
          };
          var theXml = xml(theEventObject, true);
                var newIoProject = new ioRequest({fcpxml: theXml, submissionTs: postTs});
                newIoProject.save((err)=> {
                  // console.log("saved result:\n" + JSON.stringify(newIoProject, null, 5));
              mongoose.connection.close();
            });
      // console.log(theXml);

      fs.writeFileSync(pathForXml, theXml);
      console.log("done");
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
