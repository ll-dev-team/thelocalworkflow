// written to cope with some bad Compressor renaming (accidentally left destination set to "source")

var fs = require("fs");
var path = require("path");
var args = require('minimist')(process.argv.slice(2));

var re = /^\./;

function ProxyFile(filePath){
    // console.log(filePath);
    this.ext = path.extname(filePath);
    this.dirForRenaming = path.dirname(filePath);
    // console.log(this.dirForRenaming);
    this.wrongBasename = path.basename(filePath, this.ext);
    this.newBasename = this.wrongBasename.split("-")[0];
    // console.log(this.newBasename);
    this.pathForRenaming = path.join(this.dirForRenaming, (this.newBasename + "" + this.ext));
    fs.renameSync(filePath, this.pathForRenaming);
    console.log(this.pathForRenaming);
};

if (args.folder){
  console.log("going to rename everything in folder " + args.folder);
  var files = fs.readdirSync(args.folder);
  var proxyFileArray = [];
  files.forEach(function(thisFile){
    if (re.test(thisFile)) {
      console.log("thisFile (" + thisFile + ") is not a camera file");
    }
    else {
      var thisProxyFile = new ProxyFile(path.join(args.folder, path.basename(thisFile)))
      proxyFileArray.push(thisProxyFile);
      // console.log(JSON.stringify(proxyFileArray, 2, null));
    }
  });
}

if (!(args.folder)) {
  console.log("remember --folder argument.");
  process.exit(1);
}
