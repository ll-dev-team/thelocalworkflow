var columnify = require('columnify');
var fs = require('fs');
var shootprocessor = require("./mk_modules/shootprocessor");
var ffprobetools = require("./mk_modules/ffprobetools");
var args = require("minimist")(process.argv.slice(2));
const xml = require('xml');



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

// console.log("here are the resources so far");
// console.log(JSON.stringify(resourceXML.resources));
// console.log("trying for resource 3");
// console.log(resourceXML.resources[2].asset._attr.start);
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

//
// libraryXML.library.event.push({_attr:{name:"20170807_001_MK_Test"}});
// libraryXML.library.event.push({clip:{name:"20170807_001_MK_Test_C300a_001", duration:"2906904/24000s", start:"1474236764/24000s", format:"r1", tcFormat:"NDF"}});

fcpxObject = {fcpxml:[fcpxmlAttr, resourceXML, libraryXML]}

// console.log("\n**************\n\n trying whole fcpxObject now \n");
// console.log(JSON.stringify(fcpxObject, null, 2));

theXmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n'

var theXml = (theXmlHeader + (xml(fcpxObject, {indent:'\t'})));
console.log("\n\nhere is theXml we hope:\n\n" + theXml);

var shootId = "20170807_001_MK_Test";
var filePath = ("./tests/output/" + shootId + ".fcpxml")
fs.writeFileSync(filePath, theXml);


// console.log(JSON.stringify(libraryXML, null, 2));
// console.log(Object.prototype.toString.call(libraryXML.library.event));


// console.log("\n\n\n\n\n"+JSON.stringify(resourceXML, null, 2));
//
//
//
// console.log("\n\n\n\n\n"+JSON.stringify(libraryXML, null, 2));
//
// console.log("\n\n\n\n\n"+JSON.stringify(libraryXML.library, null, 2));
//
// console.log("\n\n\n\n\n"+JSON.stringify(libraryXML.library._attr, null, 2) + "\n\nis where the problem seems to be\n\n");




function Clip(clipPath){
  this.ffprobeOutput=ffprobetools.ffprobeSync(clipPath);
  videoMetaObject = JSON.parse(this.ffprobeOutput);
  this.path = clipPath;
  // console.log(this.ffprobeOutput);
  this.width = videoMetaObject.streams[0].width;
  this.height = videoMetaObject.streams[0].height;
  this.codec_time_base = videoMetaObject.streams[0].codec_time_base;
  this.codec_long_name = videoMetaObject.streams[0].codec_long_name;
  this.duration_ts = videoMetaObject.streams[0].duration_ts;
  this.duration = videoMetaObject.streams[0].duration;
  this.bit_rate = videoMetaObject.streams[0].bit_rate;
  this.nb_frames = videoMetaObject.streams[0].nb_frames;
  this.codec_time_base_numerator = this.codec_time_base.split('/')[0]
  this.codec_time_base_denominator = this.codec_time_base.split('/')[1]
  console.log(this.width);
};

clip1 = new Clip('/Users/mk/Desktop/plane_gif.mov');
console.log(clip1.duration);
var throughDiv = clip1.duration*clip1.codec_time_base_denominator/clip1.codec_time_base_numerator;
console.log("through Div it is " + throughDiv);















// if (args.shootid){
//     var date = shootprocessor.dateFromId(args.shootid);
//     console.log("\n\n\n\nHello " + date.date + "\n\n\n\n");
// }
