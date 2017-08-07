var fs = require("fs");
var columnify = require('columnify');
var path = require("path");
var ffprobetools = require("./ffprobetools");
var re = /^\./;

function rename(folderPath) {
  var probeArray = [];
  var dirBase = path.basename(folderPath);
  var fileList = [];
  var fileObjectList =[];
  console.log('is the directory base ' + dirBase + '?\n\n');
  var folders = fs.readdirSync(folderPath);
  folders.forEach(function(camFolder){
    var fullPath = path.join(folderPath,camFolder);
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
          var oldPath = path.join(folderPath, camFolder, file);
          // ffprobetools.ffprobe(oldPath, probeArray);
          console.log("about to do ffprobe on " + oldPath);
          var video_metadata=ffprobetools.ffprobeSync(oldPath);
          var videoMetaObject = JSON.parse(video_metadata);
          console.log("done ffprobe");
          var newPath = path.join(folderPath, newName);
          var fileInfo = {"oldPath":oldPath, "newPath":newPath, "newName":newName, "ext":ext, "camera":camFolder, "shoot":dirBase, ffprobe:videoMetaObject};
          // add to above ultimately
          // , "ffprobe":video_metadata

          console.log("just a test---here is the new path accessed via fileInfo.newPath: " + fileInfo.newPath);
          console.log("\n");
          // console.log('and maybe this is the codec_long_name if ffprobeSync is working? \t' +  fileInfo.video_metadata.streams[0].codec_long_name);
          console.log('trying just the stdout now ' + video_metadata);
          fileList.push(newPath);
          fileObjectList.push(fileInfo);
          var update = ("\ngoing to try to rename \t\t" + oldPath + "\t to \t" + newPath)
          console.log(update);
          fs.appendFileSync('./tests/logs/log.txt', update);
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
  fs.appendFile('./tests/logs/log.txt', ("\n\n" + columns), function (err) {
    if (err) {
      console.log("didn't work");
    } else {
      // done
    }
  })
  var theResult = {shots: fileList, objects: fileObjectList, probes: probeArray};
  return theResult;
}

function testIt(string) {
  console.log("shootprocessor is working, and the string should be: " + string);
}

function dateFromId(shootId) {
  console.log("working in dateFromId with " + shootId);
  var regexTest = /^\d{8}/;
  var dateRoot = shootId.slice(0,8);
  if (regexTest.test(dateRoot)) {
    var y = dateRoot.substr(0,4),
        m = dateRoot.substr(4,2),
        d = dateRoot.substr(6,2);
    var D = new Date(y,m,d);
    console.log("the date is " + D);
    // return (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d) ? D : 'invalid date';
    return {dateString:dateRoot, date: D};
  }
  else {
    console.log(shootId + "'s dateRoot " + dateRoot + " is not a valid date string");
  }
}

module.exports.rename = rename;
module.exports.echo = testIt;
module.exports.dateFromId = dateFromId;
