const fs = require('fs');
const xml = require('xml');
const path = require('path');
const cp = require('child_process');
var args = require('minimist')(process.argv.slice(2));

//grabbing stuff from the CL for testing, but will call this function in io2s eventually
// var outputFolderPath = "/Users/laurendavidson/Development/io2s\ Testing";

// var theEventObject = require(args.event);
// var inputXmlObject = require(args.xmlObject);

// makeIo2sXml(theEventObject, inputXmlObject, outputFolderPath)


function makeIo2sXml(theEventObject, inputXmlObject, jsonFolderPath){ //change name of path variable

// console.log("here is the object: " + inputXmlObject);

  var fcpxmlAttr = {_attr:{version:'1.7'}};

  var libraryXml = {library: []};
  libraryAttr = {_attr: {location: inputXmlObject.fcpxml.library[0].$.location}}
  libraryXml.library.push(libraryAttr);
  libraryXml.library.push(theEventObject);

  console.log("here are the culprits: " + inputXmlObject.fcpxml.resources[0].asset[0].metadata[0].md[3].array[0].string[0] + " " + inputXmlObject.fcpxml.resources[0].asset[0].metadata[0].md[3].array[0].string[1]);


  var theResourceXml = makeResources(inputXmlObject);

  fcpxObject = {fcpxml:[fcpxmlAttr, theResourceXml, libraryXml]}
  theXmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n\n'
  var theXml = (theXmlHeader + (xml(fcpxObject, {indent:'\t'})));
  fs.writeFileSync(jsonFolderPath, theXml);

  var newJsonPath = "/Users/laurendavidson/Development/io2s\ Testing/fcpxObject.json"
  fs.writeFileSync(newJsonPath, JSON.stringify(fcpxObject, null, 4));

return theXml;
}


function makeResources(inputXmlObject){
  var resourceXml = {resources: []};

//move this after assets when assets is finished
  var format = {format:
                        {_attr:
                          {
                            id: inputXmlObject.fcpxml.resources[0].format[0].$.id,
                            name: inputXmlObject.fcpxml.resources[0].format[0].$.name,
                            frameDuration:inputXmlObject.fcpxml.resources[0].format[0].$.frameDuration,
                            width: inputXmlObject.fcpxml.resources[0].format[0].$.width,
                            height: inputXmlObject.fcpxml.resources[0].format[0].$.height,
                            colorSpace: inputXmlObject.fcpxml.resources[0].format[0].$.colorSpace
                          }
                        }
                      };

  resourceXml.resources.push(format);

  for (var i = 0; i < inputXmlObject.fcpxml.resources[0].asset.length; i++) {

    var thisAsset = {asset:
                      {_attr:
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
                      },
                      metadata:
                      [
                        {
                          md: [
                            {
                              _attr: {
                                key: inputXmlObject.fcpxml.resources[0].asset[i].metadata[0].md[0].$.key,
                                value: inputXmlObject.fcpxml.resources[0].asset[i].metadata[0].md[0].$.value
                              }
                            },
                            {
                              _attr: {
                                key: inputXmlObject.fcpxml.resources[0].asset[i].metadata[0].md[1].$.key,
                                value: inputXmlObject.fcpxml.resources[0].asset[i].metadata[0].md[1].$.value
                              }
                            },
                            {
                              _attr: {
                                key: inputXmlObject.fcpxml.resources[0].asset[i].metadata[0].md[2].$.key,
                                value: inputXmlObject.fcpxml.resources[0].asset[i].metadata[0].md[2].$.value
                              }
                            },
                            {
                              _attr: {
                                key: inputXmlObject.fcpxml.resources[0].asset[i].metadata[0].md[3].$.key
                              },
                              array: [
                                {
                                  string: [
                                    inputXmlObject.fcpxml.resources[0].asset[0].metadata[0].md[3].array[0].string[0],
                                    inputXmlObject.fcpxml.resources[0].asset[0].metadata[0].md[3].array[0].string[1]
                                  ]
                                }
                              ]
                            },
                          {
                            _attr: {
                              key: inputXmlObject.fcpxml.resources[0].asset[0].metadata[0].md[4].$.key,
                              value: inputXmlObject.fcpxml.resources[0].asset[0].metadata[0].md[4].$.value
                            }
                          }
                          ]

                        }
                      ]

                    }};

      resourceXml.resources.push(thisAsset);
  }

  var theMc = {media:[
                      {_attr:
                        {
                          id: inputXmlObject.fcpxml.resources[0].media[0].$.id,
                          name: inputXmlObject.fcpxml.resources[0].media[0].$.name,
                          uid: inputXmlObject.fcpxml.resources[0].media[0].$.uid,
                          modDate: inputXmlObject.fcpxml.resources[0].media[0].$.modDate
                        }
                      },
                      {multicam: [
                        {_attr:
                          {
                            format: inputXmlObject.fcpxml.resources[0].media[0].multicam[0].$.format,
                            tcStart: inputXmlObject.fcpxml.resources[0].media[0].multicam[0].$.tcStart,
                            tcFormat: inputXmlObject.fcpxml.resources[0].media[0].multicam[0].$.tcFormat
                          }
                        },
                      ]
                    }
                  ]
                };

  for (var i = 0; i < inputXmlObject.fcpxml.resources[0].media[0].multicam['mc-angle'].length; i++) {

    var thisAngle = {mc-angle: [
            {_attr:
              {
                name: inputXmlObject.fcpxml.resources[0].media[0].multicam['mc-angle'].$.name,
                angleID: inputXmlObject.fcpxml.resources[0].media[0].multicam['mc-angle'].$.angleID
              }
            },
            {gap: [
              {_attr:

              }
              
            ]}
          ]}
  }

      resourceXml.resources.push(theMc);


  // var theMedia = {media:
  //   [
  //     {_attr: {name: (shootObject.shootId + "_MC_CC"), id:("r"+ccR), modDate: dateFormat(now, "yyyy-mm-dd HH:MM:ss o")}},
  //     {sequence: [
  //       {_attr: {duration: (shootObject.mcDuration +"/24000s"), format: "r1", renderColorSpace:"Rec. 709", tcStart:(shootObject.startClip.start_ts + "/24000s"), tcFormat:"NDF"}},
  //       {spine:
  //         [
  //           {"mc-clip":
  //           [
  //             {_attr:{name: (shootObject.shootId + "_MC"), offset: (shootObject.startClip.start_ts + "/24000s"), ref:shootObject.resourceMcCounterR, duration:(shootObject.mcDuration +"/24000s"), start: (shootObject.startClip.start_ts + "/24000s")}},
  //             {"mc-source": [
  //               {_attr:{angleID: ("0000"+anglesToAdd[0]), srcEnable:"all"}},
  //               {"filter-video":[
  //                 {_attr:{ref:shootObject.fcpxml.motionEffectA.effect._attr.id, name:"2.5-cam-A-2018"}},
  //                 {param:{_attr: {
  //                   name:"Position",
  //                   key:"9999/32385/10619/1/100/101",
  //                   value:"-19.3779 -232"}}},
  //                 {param:{_attr: {
  //                   name:"Alignment",
  //                   key:"9999/32385/10619/2/354/10624/401",
  //                   value:"2 (Right)"}}},
  //                 {param:{_attr: {
  //                   name:"Line Spacing",
  //                   key:"9999/32385/10619/2/354/10624/404",
  //                   value:"-2"}}},
  //                 {param:{_attr: {
  //                   name:"Text",
  //                   key:"9999/32385/10619/2/369",
  //                   value:shootObject.shootId + ""}}},
  //                 {param:{_attr: {
  //                   name:"Position",
  //                   key:"9999/32385/20673/1/100/101",
  //                   value:"-16.824 -180"}}},
  //                 {param:{_attr: {
  //                   name:"Alignment",
  //                   key:"9999/32385/20673/2/354/20674/401",
  //                   value:"2 (Right)"}}},
  //                 {param:{_attr: {
  //                   name:"Text",
  //                   key:"9999/32385/20673/2/369",
  //                   value:(shootObject.projectId + ": " + shootObject.subId)}}},
  //                 {param:{_attr: {
  //                   name:"Position",
  //                   key:"9999/32385/20837/1/100/101",
  //                   value:"-443.584 -395"}}},
  //                 {param:{_attr: {
  //                   name:"Alignment",
  //                   key:"9999/32385/20837/2/354/20838/401",
  //                   value:"2 (Right)"}}},
  //                 {param:{_attr: {
  //                   name:"Text",
  //                   key:"9999/32385/20837/2/369",
  //                   value:(shootObject.shootIdDate+":")}}}
  //               ]}
  //             ]}
  //           ]
  //         }]
  //       }]
  //     }
  //   ]
  // };




console.log(JSON.stringify(resourceXml, null, 4));


  return resourceXml;
}

module.exports.makeIo2sXml = makeIo2sXml;
