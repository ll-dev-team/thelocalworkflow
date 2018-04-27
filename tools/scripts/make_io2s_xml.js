const fs = require('fs');
const xml = require('xml');
const path = require('path');
const cp = require('child_process');

var outputFolderPath = "/Users/laurendavidson/Development/io2s\ Testing";

makeIo2sXml(args.event, args.xmlObject, outputFolderPath)


function makeIo2sXml(theEventObject, inputXmlObject, jsonFolderPath){

  var fcpxmlAttr = {_attr:{version:'1.7'}};

  var libraryXml = {library: []};
  libraryAttr = {_attr: {location: inputXmlObject.fcpxml.library[0].$.location}}
  libraryXml.library.push(libraryAttr);
  libraryXml.library.push(theEventObject);

  var theResourceXml = makeResources(inputXmlObject);

  fcpxObject = {fcpxml:[fcpxmlAttr, theResourceXml, libraryXml]}
  theXmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n'
  var theXml = (theXmlHeader + (xml(fcpxObject, {indent:'\t'})));
  var theXmlPath = path.join (jsonFolderPath, "newXml.fcpxml") //put in a better name here when finished
  fs.writeFileSync(theXmlPath, theXml);

return theXml;
}


function makeResources(inputXmlObject){
  var resourceXml = {resources: []};

//move this after assets when assets is finished
  var format = {format:
                        {_attr:
                          {
                            id: inputXmlObject.fcpxml.resources[0].format[0].$.id,
                            name: inputXmlObject.fcpxml.resources[0].format[0].$.name, frameDuration:inputXmlObject.fcpxml.resources[0].format[0].$.frameDuration,
                            width: inputXmlObject.fcpxml.resources[0].format[0].$.width,
                            height: inputXmlObject.fcpxml.resources[0].format[0].$.height,
                            colorSpace: inputXmlObject.fcpxml.resources[0].format[0].$.colorSpace
                          }
                        }
                      };
  resourceXml.resources.push(format);

  var assets = {asset: []};

  for (var i = 0; i < inputXmlObject.fcpxml.resources[0].asset.length; i++) {
    var thisAsset = {_attr:
                      {
                        id: inputXmlObject.fcpxml.resources[0].asset[i].$.id,
                        name: inputXmlObject.fcpxml.resources[0].asset[i].$.name,
                        uid: inputXmlObject.fcpxml.resources[0].asset[i].$.uid,
                        src: inputXmlObject.fcpxml.resources[0].asset[i].$.src,
                        start: inputXmlObject.fcpxml.resources[0].asset[i].$.start,
                        duration: inputXmlObject.fcpxml.resources[0].asset[i].$.duration,
                        hasVideo: inputXmlObject.fcpxml.resources[0].asset[i].$.hasVideo,
                        format: inputXmlObject.fcpxml.resources[0].asset[i].$.format,
                        hasAudio: inputXmlObject.fcpxml.resources[0].asset[i].$.hasAudio,
                        audioSources: inputXmlObject.fcpxml.resources[0].asset[i].$.audioSources,
                        audioChannels: inputXmlObject.fcpxml.resources[0].asset[i].$.audioChannels,
                        audioRate: inputXmlObject.fcpxml.resources[0].asset[i].$.audioRate
                      }
                    };
      assets.asset.push(thisAsset);
  }

  resourceXml.resources.push(assets);




  return resourceXml;
}
