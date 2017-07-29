function printHelp() {
  console.log("rename.js (c) Marlon Kuzmick");
  console.log("");
  console.log("usage:");
  console.log("--help             print help");
  console.log("--name             say hello to {NAME}");
  console.log("--file             read out {FILE}");
}

var args = require('minimist')(process.argv.slice(2));

if (args.help || !(args.name || args.file)) {
  printHelp();
  process.exit(1);
}

// var args = require("minimist")(process.argv.slice(2),{ string: "name"});

var fs = require('fs');
var usefile = require('./mk_modules/usefile');
var args = require("minimist")(process.argv.slice(2));
var tctools = require("./mk_modules/timecodetools");

if (args.name){
    var name = args.name;
    console.log("\n\n\n\nHello " + name + "\n\n\n\n");
}


//
// fs.readFile('package.json', 'utf-8', function(err, data) {
//   // TODO: Error Handling Still Needed!
//   console.log(JSON.stringify(data));
// });


if (args.file) {
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
