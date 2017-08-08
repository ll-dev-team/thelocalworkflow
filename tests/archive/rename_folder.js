// var args = require('minimist')(process.argv.slice(2));

// USE MINIMIST IF WE WANT TO PASS MULTIPLE DIFFERENT ARGS IN
// JUST GO WITH process.argv IF WE ARE ONLY LOOPING A SPECIFIED folder

var fs = require("fs");
var columnify = require('columnify');
var path = require("path");
var args = process.argv.slice(2);
var dir = args[0];
var re = /^\./;
// dir = args.path;
var dirBase = path.basename(dir);
console.log('is the directory base ' + dirBase + '?\n\n');
var fileList = [];
var fileObjectList =[];


folders = fs.readdirSync(dir);
folders.forEach(function(camFolder){
  var fullPath = path.join(dir,camFolder);
  var stats = fs.statSync(fullPath);
  if (stats.isDirectory()) {
    console.log("\n\n" + camFolder + " or " + fullPath + " is a Directory\n\n");
    files = fs.readdirSync(fullPath);
    i = 1;
    files.forEach(function(file) {
      console.log("the file we're working with is " + file);
      console.log("and it's from camera " + camFolder);
      var reTest = re.test(file);
      console.log("and the re test returned " + reTest);
      if (re.test(file)) {
        console.log("\n\nWE ARE NOT GOING TO RENAME THIS ONE\n\n");
      }
      else {
        var ext = path.extname(file);
        var basename = path.basename(file, ext);
        var dir = path.dirname(file);
        var counter = ("000" + i).slice(-3)
        var newName = (dirBase + "_" + camFolder + "_" + counter + ext)
        i++;
        var oldPath = path.join(dir, file)
        var newPath = path.join(dir, newName);
        var fileInfo = {"oldPath":oldPath, "newPath":newPath, "newName":newName, "ext":ext, "camera":camFolder, "shoot":dirBase};
        console.log("just a test---here is the new path accessed via fileInfo.newPath: " + fileInfo.newPath);
        fileList.push(newPath);
        fileObjectList.push(fileInfo);
        var update = ("\ngoing to try to rename \t\t" + oldPath + "\t to \t" + newPath)
        console.log(update);
        fs.appendFileSync('./logs/log.txt', update);
      }
      // fs.renameSync(filePath, newFilePath);
    });
  }
  else {
    console.log("\n\n" + camFolder + " or " + fullPath + " is not a camera directory\n\n");
  }
})



console.log(fileList.join());

var columns = columnify(fileObjectList);
console.log(columns);


fs.appendFile('./logs/log.txt', ("\n\n" + columns), function (err) {
  if (err) {
    console.log("didn't work");
  } else {
    // done
  }
})
