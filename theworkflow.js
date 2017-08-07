function printHelp() {
  console.log("rename.js (c) Marlon Kuzmick");
  console.log("");
  console.log("usage:");
  console.log("--help             print help");
  console.log("--name             say hello to {NAME}");
  console.log("--file             read out {FILE}");
  console.log("--shootfolder      rename files in {FOLDER}");
}

var args = require('minimist')(process.argv.slice(2));

if (args.help || !(args.name || args.file || args.video || args.shootfolder)) {
  printHelp();
  process.exit(1);
}

// var args = require("minimist")(process.argv.slice(2),{ string: "name"});

var columnify = require('columnify');
var fs = require('fs');
var usefile = require('./mk_modules/usefile');
var tctools = require("./mk_modules/timecodetools");
var shootprocessor = require("./mk_modules/shootprocessor")
var args = require("minimist")(process.argv.slice(2));

if (args.name){
    var name = args.name;
    console.log("\n\n\n\nHello " + name + "\n\n\n\n");
}

if (args.textfile) {
  console.log("the text file path is " + args.textfile);
  var contents = usefile.say(args.file, function(err, contents){
    if (err) {
      console.error("Error: " + err);
    }
    else console.log(contents);
  })
}

if (args.file) {
  console.log("the file path is " + args.textfile);
  var contents = usefile.say(args.file, function(err, contents){
    if (err) {
      console.error("Error: " + err);
    }
    else console.log(contents);
  })
}

if (args.video) {
  console.log("the video path is " + args.video);
  tctools.ffprobe(args.video);
  tctools.echo("try to echo this");
}

if (args.shootfolder) {
  console.log("the folder path to the files we want to rename is " + args.folder);
  var theResult = shootprocessor.rename(args.shootfolder);
  shootprocessor.echo("try to echo this in shootprocessor");
  console.log("now testing what got returned");
  console.log("theResult.shots = " + theResult.shots);
  console.log("theResult.objects = " + JSON.stringify(theResult.objects));
  console.log("\n\nnow testing columnify\n" + columnify(theResult.objects));
  console.log("theResult.probes = " + JSON.stringify(theResult.probes));
}
