const xml = require('xml');
const fs = require("fs");
const columnify = require('columnify');
const path = require("path");
const ffprobetools = require("./ffprobetools");
const shootprocessor = require("./shootprocessor");

function makeFcpxml(shootObject){
  var clipsForXml = [];
  // define format for each unique format---define on first clip then check each subsequent clip against this format?
  var theFormats = makeFormats(shootObject);
  console.log("in the makeFcpxml function and logging out stringified formats " + JSON.stringify(theFormats, null, 2));

  // add clips to an array for clips

  shootObject.clipArray.forEach(function(clip, index){
    console.log(index + ". " + clip.newBasenameExt + " needs to be added");
    theFormats.push(clip.fcpxmlElements);
  });

  var fcpxmlAttr = {_attr:{version:'1.5'}};
  var libraryXml = {library: []};
  libraryAttr = {_attr: {location: "file:///Users/mk/Development/temp/Untitled.fcpbundle/"}}
  libraryXml.library.push(libraryAttr);
  var libraryEventOne = {event:[{_attr:{name:shootObject.shootId}}]};
  shootObject.clipArray.forEach(function(thisClip, index) {
    console.log("in fcpxml and working on" + thisClip.newBasenameExt);
    var audio = {audio: {_attr: {lane:"-1", offset:"44227102920/720000s"}}};
    var video = {video: [{_attr: {offset:"44227102920/720000s", ref:"r2"}}, audio]};
    var clip = {clip: [{_attr: {name:thisClip.newBasename, duration:thisClip.fcpxmlElements.duration}}, video]}
    libraryEventOne.event.push(clip);
  });
  libraryXml.library.push (libraryEventOne);
  // console.log(JSON.stringify(libraryXml.library[0], null, 2));
  // console.log("\n\nand now maybe the event?\n" + JSON.stringify(libraryXml.library[1], null, 2) );
  fcpxObject = {fcpxml:[fcpxmlAttr, theFormats, libraryXml]}
  // console.log("\n**************\n\n trying whole fcpxObject now \n");
  // console.log(JSON.stringify(fcpxObject, null, 2));
  theXmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n'

  var theXml = (theXmlHeader + (xml(fcpxObject, {indent:'\t'})));
  console.log("\n\nhere is theXml we hope:\n\n" + theXml);

  var shootId = "20170807_001_MK_Test";
  var filePath = (shootObject.shootPath + "/" + shootId + "_v1.fcpxml")
  fs.writeFileSync(filePath, theXml);

}

function makeFormats(shootObject){
  console.log("\n\n\n\nstarting makeFormats");
  var resourceXml = {resources: []};
  console.log("structure of resourceXml =" + JSON.stringify(resourceXml, null, 2));
  // function isFormatThere(clip){
  shootObject.clipArray.forEach(function(clip, index){
    console.log("1. " + resourceXml.resources.length + " is the current length of .resources");
    if (resourceXml.resources.length==0){
      console.log("2. hitting first if statement---adding ");
      var theNewFormat = {format:{_attr:{id:"r1", frameDuration:(clip.codec_time_base+"s"), width:clip.width, height:clip.height}}};
      // resourceXml.resources.push(theNewFormat);
      // console.log("3. pushed theNewFormat and the length of resources is now " + resourceXml.resources.length);
    }
    else {
      console.log("starting the test for " + clip.newBasenameExt);
      console.log("index is " + index);
      console.log("resource array length is now " + resourceXml.resources.length);
      formatMatch = false;
      for (var i = 0; i < resourceXml.resources.length; i++) {
        console.log("in the loop and the index is " + i);
        console.log("properties for clip = "+ clip.width + clip.height + clip.codec_time_base );
        console.log("properties for resourceXml format = " + resourceXml.resources[i].format._attr.width + resourceXml.resources[i].format._attr.height + resourceXml.resources[i].format._attr.frameDuration);
        if (clip.width == resourceXml.resources[i].format._attr.width && clip.height == resourceXml.resources[i].format._attr.height && (clip.codec_time_base+"s") == resourceXml.resources[i].format._attr.frameDuration) {
          formatMatch=true;
          console.log("format match");
        }
        else {
          console.log("no format match");
        }
      }
      console.log("formatMatch is now " + formatMatch);
      if (formatMatch == false){
        console.log("adding format variable");
        var theNewFormat = {format:{_attr:{id:"r1", name:"FFVideoFormat1080p2398", frameDuration:(clip.codec_time_base+"s"), width:clip.width, height:clip.height}}};
        console.log(JSON.stringify(theNewFormat));
      }
    }
    console.log("If there is a new format it is:" + JSON.stringify(theNewFormat));
    if (theNewFormat) {
      resourceXml.resources.push(theNewFormat);
      console.log("just added format"+ JSON.stringify(resourceXml.resources, null, 2) +" for " + clip.newBasenameExt);
    }
    console.log("\n\n\n\n\n\n\n\n\n\n\n" + JSON.stringify(resourceXml.resources, null, 2));
    for (var i = 0; i < resourceXml.resources.length; i++) {
      var formatCounter = ("r"+(i+1));
      resourceXml.resources[i].format._attr.id = formatCounter;
    }
    // resourceXml.resources.foreach(function(formatResource, index){
    //   var formatCounter = ("r"+index);
    //   console.log("in foreach loop and rCounter is " + formatCounter);
    //   // formatResource.format._attr.id = formatCounter;
    // });

  });
  return resourceXml;
}

module.exports.makeFcpxml = makeFcpxml;
module.exports.makeFormats = makeFormats;
