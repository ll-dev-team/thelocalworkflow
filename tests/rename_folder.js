// var args = require('minimist')(process.argv.slice(2));
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

files = fs.readdirSync(dir);
files.forEach(function(file) {
  console.log("the file we're working with is " + file);
  var reTest = re.test(file);
  console.log("and the re test returned " + reTest);
  if (re.test(file)) {
    console.log("\n\nWE ARE NOT GOING TO RENAME THIS ONE\n\n");
  }
  else {
    var ext = path.extname(file);
    var basename = path.basename(file, ext);
    var dir = path.dirname(file);
    var newName = ("renamed_" + basename + "_001" + ext)
    var oldPath = path.join(dir, file)
    var newPath = path.join(dir, newName);
    var fileInfo = {"oldPath":oldPath, "newPath":newPath, "newName":newName, "ext":ext};
    console.log("just a test---here is the new path accessed via fileInfo.newPath: " + fileInfo.newPath);
    fileList.push(newPath);
    fileObjectList.push(fileInfo);
    var update = ("\ngoing to try to rename \t\t" + oldPath + "\t to \t" + newPath)
    console.log(update);
    fs.appendFileSync('./logs/log.txt', update);


    // fs.appendFile('./logs/log.txt', ('\nrenamed\t\t' + oldPath + "\t to \t" + newPath), function (err) {
    //   if (err) {
    //     console.log("didn't work");
    //   } else {
    //     // done
    //   }
    // })

  }
  // fs.renameSync(filePath, newFilePath);
});

console.log(fileList.join());

var columns = columnify(fileObjectList)
console.log(columns)


fs.appendFile('./logs/log.txt', ("\n\n" + columns), function (err) {
  if (err) {
    console.log("didn't work");
  } else {
    // done
  }
})



// var columns = columnify(data, {
//   columns: ['name', 'version']
// })





// fs.renameSync(oldPath, newPath);

//
//
// fs.readdir('/path/to/directory', (err, list) => {
//   list = list.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
//
//   // Your code
// });
//
// //
// var fs = require('fs'),
//     path = require('path'),
//     args = process.argv.slice(2),
//     dir = args[0],
//     match = RegExp(args[1], 'g'),
//     replace = args[2],
//     files;
//
// files = fs.readdirSync(dir);
//
// files.filter(function(file) {
//   return file.match(match);
// }).forEach(function(file) {
//   var filePath = path.join(dir, file),
//       newFilePath = path.join(dir, file.replace(match, replace));
//
//   fs.renameSync(filePath, newFilePath);
// });
//
// // Usage
// // node rename.js path/to/directory '\s' '-'
