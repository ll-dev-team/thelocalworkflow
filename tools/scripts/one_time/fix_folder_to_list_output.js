// written to cope with folder to list output (removing first part of path)

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

if (args.file){
  console.log("going to rename everything in file " + args.file);
  // var array = fs.readFileSync('file.txt').toString().split("\n");
  var lines = fs.readFileSync(args.file, 'UTF-8').split("\n");
  // console.log(lines);
  lines.forEach(function(line, index){
    var folderName = line.split('/')[1];
    if (folderName !== undefined) {
      fs.appendFileSync('/Users/mk/Development/test_materials/proxy_generation/proxy_folders.txt', (folderName + "\n"), 'UTF-8');
    }
  })
}
