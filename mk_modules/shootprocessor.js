var fs = require("fs");
// var columnify = require('columnify');
var path = require("path");
// var ffprobetools = require("./ffprobetools");
const Clip = require("./workflowobjects").Clip;
const Shoot = require("./workflowobjects").Shoot;

function rename(folderPath) {
  var re = /^\./;
  var thisShoot = new Shoot(folderPath);
  notesFolderPath=("/" + path.join(folderPath, "_notes"));
  if (fs.existsSync(notesFolderPath)) {

  }
  else {
    fs.mkdirSync(notesFolderPath);
  }

  var theseClipObjects = [];
  var cameraArray = [];
  var folders = fs.readdirSync(folderPath);
  folders.forEach(function(camFolder){
    // check if this is actually a folder, if so, push camera to .cameraArray and start looping files in it
    if (fs.statSync(path.join(folderPath,camFolder)).isDirectory()) {
      thisShoot.cameraArray.push(camFolder);
      // console.log("camera is now " + camFolder);
      var offsetForIndex = 0;
      fs.readdirSync(path.join(folderPath,camFolder)).forEach(function(file, index) {
        if (re.test(file)) {
          // if this is a hidden file, don't bother with it
          // console.log("WE ARE NOT GOING TO RENAME " + file);
          offsetForIndex++;
        }
        else {
          // console.log(index);
          // console.log(path.basename(file));
          var thisClip = new Clip(folderPath, camFolder, path.basename(file), (index - offsetForIndex));
          theseClipObjects.push(thisClip);
          // var update = ("\ngoing to try to rename \t\t" + thisClip.oldPath + "\t to \t" + thisClip.newPath)
          // console.log(update);
          // fs.appendFileSync('./tests/output/log.txt', update);
          //
          // TODO: toggle this on and off to avoid renaming while testing:
          fs.renameSync(thisClip.oldPath, thisClip.newPath);
        }
      });
    }
    else {
      // console.log(camFolder + " or is not a camera directory");
    }
  });
  // console.log("the cameraArray is: \n" + thisShoot.cameraArray );
  thisShoot.clipArray = theseClipObjects;
  shootNotes=("Log of renaming operations for " + thisShoot.shootId + ":\n");
  thisShoot.clipArray.forEach(function(clip, index){
    shootNotes=(shootNotes+(index+1)+". Renamed " + clip.oldBasenameExt + " to " + clip.newBasenameExt + "\n" )
    // console.log("renamed " + clip.newBasenameExt);
  });

  var minUtcCrStartMillTs = Math.min.apply(Math,thisShoot.clipArray.map(function(o){return o.utcTcStartMill;}));
  // console.log("minUtcCrStartMillTs" + minUtcCrStartMillTs);
  thisShoot.startClip = thisShoot.clipArray.find(function(o){ return o.utcTcStartMill == minUtcCrStartMillTs; })

  var minStartTs = Math.min.apply(Math,thisShoot.clipArray.map(function(o){return o.start_ts;}));
  // console.log("minUtcCrStartMillTs" + minUtcCrStartMillTs);
  thisShoot.tsStartClip = thisShoot.clipArray.find(function(o){ return o.start_ts == minStartTs; });
  // console.log("the tsStartClip is " +  thisShoot.tsStartClip.newBasenameExt);
  // console.log("the minStartTs is " + minStartTs);

  var maxEndTs = Math.max.apply(Math,thisShoot.clipArray.map(function(o){return o.end_ts;}));

  // console.log(thisShoot.startClip.newBasenameExt);
  thisShoot.firstMcAngle = thisShoot.startClip.cameraFolder;
  // TODO: change at some point to cope with clock-time differential.
  thisShoot.mcStartTc = thisShoot.startClip.startTc;
  // thisShoot.mcStartTs = thisShoot.startClip.start_ts;
  thisShoot.mcStartTs = minStartTs;
  thisShoot.mcEndTs = maxEndTs;
  thisShoot.mcDuration = thisShoot.mcEndTs - thisShoot.mcStartTs;
  // console.log("just computed thisShoot.mcDuration and it is " + thisShoot.mcDuration);
  // console.log("just computed thisShoot.mcEndTs and it is " + thisShoot.mcEndTs);


  thisShoot.startCrDate = thisShoot.startClip.creationDate;
  thisShoot.startTcDate = thisShoot.startClip.utcTcStartDate;
  thisShoot.tcOffset = thisShoot.startTcDate.getTime() - thisShoot.startCrDate.getTime();
  thisShoot.tcFramesOffset = (thisShoot.tcOffset*24)/1001;
  // console.log("tc starts out " + thisShoot.tcOffset + " ahead of Creation Time clock, which is " + thisShoot.tcFramesOffset + " frames.");

  shootNotesName=(thisShoot.shootId + "_shootnotes.txt")
  shootNotesPath=path.join(folderPath, "_notes", shootNotesName)
  fs.appendFile(shootNotesPath, ("\n\n" + shootNotes), function (err) {
    if (err) {
      // console.log("didn't work");
    } else {
      // done
    }
  })
  return thisShoot;
}

module.exports.rename = rename;
