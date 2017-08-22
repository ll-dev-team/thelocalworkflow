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
  console.log("would the r number at this point be related to " + theFormats.resources.length + "?");
  theFormats.resources.push(resourceMediaMulticam(shootObject));

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
  var anglesArray = [];
  // build angles array
  for (var i = 0; i < cameras.length; i++) {
    var theCamera=cameras[i];
    // buils thisAngle.clips array
    var thisAngle={name:theCamera, clips: []};

    console.log("in the camera loop and working on camera " + thisAngle.name);
      for (var j = 0; j < shootObject.clipArray.length; j++) {
        if (shootObject.clipArray[j].cameraFolder == theCamera) {
          thisAngle.clips.push(shootObject.clipArray[j]);
        }
      }
      anglesArray.push(thisAngle);
    };
  // loop through angles, then through clips and build xml for clips and gaps
  var clipToPush = {media:[ {_attr: {name: (shootObject.shootId + "_MC")} }, {multicam: [{_attr: {format: "r1" }}] } ] };
  var thisMcStartTs = shootObject.mcStartTs;
  anglesArray.forEach(function(thisAngle, index){
    var insertionPoint = shootObject.mcStartTs;
      thisAngle.camera=cameras[index]
      console.log("working on angle including" + thisAngle.clips[0].newBasenameExt + " and the index is " + index + " and hopefully camera is " + thisAngle.camera);
      // push the name of the camera to the clip to push
      clipToPush.media[1].multicam.push({"mc-angle":[{_attr: {name: thisAngle.camera}}]});
      var tempIndex=(clipToPush.media[1].multicam.length-1);
      // loop clips in angle
      thisAngle.clips.forEach(function(thisClip, index)
        {
          mcAngleToAdd = {"asset-clip": thisClip.fcpxml.mcAssetClip};
          mcAngleToAdd["asset-clip"][0]._attr.offset = ((thisClip.start_ts - thisMcStartTs) + "/24000s");
          mcAngleToAdd["asset-clip"][0]._attr.ref=thisClip.fcpxml.asset._attr.id;

          console.log(mcAngleToAdd["asset-clip"][0]._attr.offset);
          if (thisClip.start_ts == insertionPoint){
            console.log(thisClip.newBasenameExt + " is at the start of the multi or previous clip, so no gap needed");
            clipToPush.media[1].multicam[tempIndex]["mc-angle"].push(mcAngleToAdd);
          }
          else {
            var gapDuration = (thisClip.start_ts - insertionPoint);
            console.log(thisClip.newBasenameExt + " isn't at the start of the multi or previous clip, so a gap clip of "+
            gapDuration+" in duration will be generated");
            var gapToAdd = {"gap": {_attr:{name:"Gap", offset:((insertionPoint-thisMcStartTs) + "/24000s"), duration:( gapDuration+"/24000s"), start: "86400314/24000s"}}};
            clipToPush.media[1].multicam[tempIndex]["mc-angle"].push(gapToAdd);

            // <gap name="Gap" offset="0s" duration="360360/24000s" start="86400314/24000s"/>

            clipToPush.media[1].multicam[tempIndex]["mc-angle"].push(mcAngleToAdd);


          }
          insertionPoint = thisClip.end_ts;


        }
      );
    }
  );

  return clipToPush;
};

module.exports.makeFcpxml = makeFcpxml;
module.exports.makeFormats = makeFormats;
