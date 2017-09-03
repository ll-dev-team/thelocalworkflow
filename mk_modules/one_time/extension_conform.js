// written to get fix overwritten ext names--especially on .MOV and .MP4 files that now have .mov as their ext

var fs = require("fs");
var path = require("path");
var args = require('minimist')(process.argv.slice(2));

var re = /^\./;

function ExtConformedFile(filePath){
    // console.log(filePath);
    this.ext = path.extname(filePath);
    this.dirForRenaming = path.dirname(filePath);
    // console.log(this.dirForRenaming);
    this.basename = path.basename(filePath, this.ext);
    this.nameElements = this.basename.split("_");
    this.camera = this.nameElements[(this.nameElements.length - 2)];
    console.log(this.camera);
      if (this.camera == "5D4K" || this.camera == "GH4") {
        this.ext = ".MOV"
      }
    this.pathForRenaming = path.join(this.dirForRenaming, (this.basename + "" + this.ext));
    fs.renameSync(filePath, this.pathForRenaming);
    console.log(this.pathForRenaming);
};

if (args.folder){
  console.log("going to fix extensions for files in folder " + args.folder);
  var files = fs.readdirSync(args.folder);
  var fileArray = [];
  files.forEach(function(thisFile){
    if (re.test(thisFile)) {
      console.log("thisFile (" + thisFile + ") is not a camera file");
    }
    else {
      var thisFile = new ExtConformedFile(path.join(args.folder, path.basename(thisFile)))
      fileArray.push(thisFile);
      // console.log(JSON.stringify(proxyFileArray, 2, null));
    }
  });
}

if (!(args.folder)) {
  console.log("remember --folder argument.");
  process.exit(1);
}
