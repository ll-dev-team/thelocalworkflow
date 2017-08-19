const xml = require('xml');
const fs = require("fs");
const columnify = require('columnify');
const path = require("path");
const ffprobetools = require("./ffprobetools");
const shootprocessor = require("./shootprocessor");

function makeFcpxml(shootObject){
  // define key variables for fcpxml---mainly container arrays for the clip, format and mc or cc resources to come.
  var clipsForXml = [];
  var theFormats = makeFormats(shootObject);
  // add clips to an array for clips for the RESOURCES element
  var fcpxmlAttr = {_attr:{version:'1.6'}};
  var libraryXml = {library: []};
  libraryAttr = {_attr: {location: "file:///Users/mk/Development/temp/Untitled.fcpbundle/"}}
  libraryXml.library.push(libraryAttr);
  var libraryEventOne = {event:[{_attr:{name:shootObject.shootId}}]};
  var keywordTextArray = [];
  var keywordsToAdd = [];
  var keywordArray = [];

  shootObject.clipArray.forEach(function(clip, index){
    var theCounter=theFormats.resources.length + 1;
    clip.fcpxml.asset._attr.id = ("r"+theCounter);
    theFormats.resources.push({asset: clip.fcpxml.asset});
    clip.fcpxml.assetClip[0]._attr.ref=clip.fcpxml.asset._attr.id;
    clip.fcpxml.assetClip[0]._attr.format=clip.fcpxml.asset._attr.format;
    var newLibraryAssetClip = {"asset-clip": clip.fcpxml.assetClip};
    libraryEventOne.event.push(newLibraryAssetClip);
    // loop through all assetClips
    for (var i = 1; i < clip.fcpxml.assetClip.length; i++) {
      // split the array of keywords in value property
      var thisClipKeywordArray=(clip.fcpxml.assetClip[i].keyword._attr.value.split(','));
      // loop through keywords, trim space, if not in array already then push
      for (var j = 0; j < thisClipKeywordArray.length; j++) {
        var theKeyword=thisClipKeywordArray[j].trim();
        if (!(keywordArray.includes(theKeyword))){
          keywordArray.push(theKeyword);
        }
      }
    }
  });
  // loop through keywordArray to build keyword-collection elements for library
  // resourceMc = resourceMediaMulticam(shootObject);
  libraryEventOne.event.push(resourceMediaMulticam(shootObject));
  for (var i = 0; i < keywordArray.length; i++) {
    thisKeywordElement={"keyword-collection": {_attr:{name:keywordArray[i]}}};
    // console.log(JSON.stringify(thisKeywordElement, null, 2));
    libraryEventOne.event.push(thisKeywordElement);
  }
  // add all of the resources to the library chunk of xml
  libraryXml.library.push(libraryEventOne);
  fcpxObject = {fcpxml:[fcpxmlAttr, theFormats, libraryXml]}
  theXmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n'
  var theXml = (theXmlHeader + (xml(fcpxObject, {indent:'\t'})));
  var filePath = (shootObject.shootPath + "/" + shootObject.shootId + "_v1.fcpxml");
  fs.writeFileSync(filePath, theXml);
  var pathForJson = (shootObject.shootPath + "/" + shootObject.shootId + "_fcpxObject.json");
  var fcpxJson = JSON.stringify(fcpxObject, null, 2);
  fs.writeFileSync(pathForJson, fcpxJson);
}

function makeFormats(shootObject){
  var resourceXml = {resources: []};
  shootObject.clipArray.forEach(function(clip, index){
    // if no format, initiate first format
    if (resourceXml.resources.length==0){
      var theNewFormat = {format:{_attr:{id:"r1", frameDuration:(clip.codec_time_base+"s"), width:clip.width, height:clip.height}}};
    }
    else {
      // for the rest of the clips, loop through the formats in search of a match
      formatMatch = false;
      for (var i = 0; i < resourceXml.resources.length; i++) {
        if (clip.width == resourceXml.resources[i].format._attr.width && clip.height == resourceXml.resources[i].format._attr.height && (clip.codec_time_base+"s") == resourceXml.resources[i].format._attr.frameDuration) {
          formatMatch=true;
          clip.fcpxml.asset._attr.format = ("r" + (i+1))
          // console.log("match");
        }
        else {
          // console.log("no match");
        }
      }
      // if no match, then create new format
      if (formatMatch == false){
        var theNewFormat = {format:{_attr:{frameDuration:(clip.codec_time_base+"s"), width:clip.width, height:clip.height}}};
      }
    }
    // if there's a new format, add it to the list
    if (theNewFormat) {
      theNewFormat.format._attr.id = ("r" + (resourceXml.resources.length+1));
      resourceXml.resources.push(theNewFormat);
      clip.fcpxml.asset._attr.format = ("r" + resourceXml.resources.length);
      // console.log(JSON.stringify(clip.fcpxml.asset._attr, null, 2));
    }
  });
  return resourceXml;
}

function resourceMediaMulticam(shootObject){
  var cameras = shootObject.cameraArray;
  // TODO: always define as "r1" and always define r1 as 1080x1920, 23.98?
  var clipToPush = {media:[ {_attr: {name: (shootObject.shootId + "_MC")} }, {multicam: [{_attr: {format: "r1" }}] } ] };
  var insertionPoint = shootObject.mcStartTs;
  console.log("\n\n\n\n\n\n\n\ncurrent clip to push is " + clipToPush.media[0]._attr.name + "\nand the insertionPoint is now " + insertionPoint);
  for (var i = 0; i < cameras.length; i++) {
    var theCamera=cameras[i];
    console.log("in the camera loop and working on camera " + theCamera);
    clipToPush.media[1].multicam.push({"mc-angle":[{_attr: {name: theCamera}}]});
    var tempIndex=(clipToPush.media[1].multicam.length-1);
    for (var j = 0; j < shootObject.clipArray.length; j++) {
      console.log("in the clip loop and working on shot " + shootObject.clipArray[j].newBasenameExt);
      if (shootObject.clipArray[j].cameraFolder == theCamera) {
        mcAngleToAdd = {"asset-clip": shootObject.clipArray[j].fcpxml.mcAssetClip};
        clipToPush.media[1].multicam[tempIndex]["mc-angle"].push(mcAngleToAdd);
        console.log("in the if statement and it checks out.\n\nNow adding " + shootObject.clipArray[j].newBasenameExt + " to the MC.");


      // nThe insertionPoint is now " + insertionPoint + "\n and the start_ts for this clip is + " shootObject.clipArray[j].start_ts + "\nThe duration_ts is " + shootObject.clipArray[j].duration_ts + "\nAnd the end_ts is " + shootObject.clipArray[j].end_ts);
        // but figure out details on mc offset
        // and figure out if a gap is needed
      }
    }
  }
  return clipToPush;
};

module.exports.makeFcpxml = makeFcpxml;
module.exports.makeFormats = makeFormats;
