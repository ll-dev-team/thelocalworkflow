const xml = require('xml');
const fs = require("fs");
const columnify = require('columnify');
const path = require("path");
const ffprobetools = require("./ffprobetools");
const shootprocessor = require("./shootprocessor");


function makeFcpxml(shootObject){
  var resourceXML = {resources: []};
  // console.log("\n\n\n\n\n"+JSON.stringify(resourceXML, null, 2));
  format={format:{_attr:{id:"r1", name:"FFVideoFormat1080p2398", frameDuration:"1001/24000s", width:"1920", height:"1080"}}};
  resourceXML.resources.push(format);
  // console.log(Object.prototype.toString.call(resourceXML.resources));
  for (var i = 2; i < 6; i++) {
      var thisId=("r"+i);
      var thisName=("file_00"+i);
      resourceXML.resources.push({asset:{_attr: {id:thisId, name:thisName, start:"13452345423/24000s", hasVideo:1, format:"r1", audioRate:"48000" }}});
  }

  var fcpxmlAttr = {_attr:{version:'1.5'}};
  var libraryXML = {library: []};
  libraryAttr = {_attr: {location: "file:///Users/mk/Development/temp/Untitled.fcpbundle/"}}
  libraryXML.library.push(libraryAttr);

  var libraryEventOne = {event:[{_attr:{name:"20170807_001_MK_Test"}}]};
  var eventClips = ["20170213_105_BTS_ZK_C300a_001", "20170213_105_BTS_ZK_C300b_001"];
  eventClips.forEach(function(clipName, index) {
    console.log(clipName);
    var audio = {audio: {_attr: {lane:"-1", offset:"44227102920/720000s"}}};
    var video = {video: [{_attr: {offset:"1474236764/24000s", ref:"r2"}}, audio]};
    var clip = {clip: [{_attr: {name:clipName, duration:"2906904/24000s"}}, video]}
    libraryEventOne.event.push(clip);
  });

  libraryXML.library.push (libraryEventOne);

  console.log(JSON.stringify(libraryXML.library[0], null, 2));
  console.log("\n\nand now maybe the event?\n" + JSON.stringify(libraryXML.library[1], null, 2) );


  fcpxObject = {fcpxml:[fcpxmlAttr, resourceXML, libraryXML]}

  // console.log("\n**************\n\n trying whole fcpxObject now \n");
  // console.log(JSON.stringify(fcpxObject, null, 2));

  theXmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n'

  var theXml = (theXmlHeader + (xml(fcpxObject, {indent:'\t'})));
  console.log("\n\nhere is theXml we hope:\n\n" + theXml);

  var shootId = "20170807_001_MK_Test";
  var filePath = ("./tests/output/" + shootId + ".fcpxml")
  fs.writeFileSync(filePath, theXml);

}



module.exports.makeFcpxml = makeFcpxml;
