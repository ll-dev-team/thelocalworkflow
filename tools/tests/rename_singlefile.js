var args = require('minimist')(process.argv.slice(2));
var fs = require("fs");
var path = require("path");


oldPath = args.path;
ext = path.extname(args.path)
basename = path.basename(args.path, ext);
dir = path.dirname(args.path);
newName = ("renamed_" + basename + "_001" + ext)
newPath = path.join(dir, newName);

console.log("going to try to rename " + oldPath + " to " + newPath);

fs.renameSync(oldPath, newPath);
