var fs = require("fs");
var path = require("path");
const Clip = require("./workflowobjects").Clip;
const Shoot = require("./workflowobjects").Shoot;

function rename(folderPath) {
  var re = /^\./;
  var thisShoot = new Shoot(folderPath);
  var theseClipObjects = [];
  var cameraArray = [];
  var folders = fs.readdirSync(folderPath);
  folders.forEach(function(camFolder){
    // check if this is actually a folder, if so, push camera to .cameraArray and start looping files in it
    if (fs.statSync(path.join(folderPath,camFolder)).isDirectory()) {
      thisShoot.cameraArray.push(camFolder);
      var offsetForIndex = 0;
      fs.readdirSync(path.join(folderPath,camFolder)).forEach(function(file, index) {
        if (re.test(file)) {
          // if this is a hidden file, don't bother with it
          offsetForIndex++;
        }
        else {
          var thisClip = new Clip(folderPath, camFolder, path.basename(file), (index - offsetForIndex));
          theseClipObjects.push(thisClip);
          // TODO: toggle this on and off to avoid renaming while testing:
          fs.renameSync(thisClip.oldPath, thisClip.newPath);
        }
      });
    }
    else {
    }
  });
  thisShoot.clipArray = theseClipObjects;
  shootNotes=("Log of renaming operations for " + thisShoot.shootId + ":\n");
  thisShoot.clipArray.forEach(function(clip, index){
    shootNotes=(shootNotes+(index+1)+". Renamed " + clip.oldBasenameExt + " to " + clip.newBasenameExt + "\n" )
  });

  var minUtcCrStartMillTs = Math.min.apply(Math,thisShoot.clipArray.map(function(o){return o.utcTcStartMill;}));
  thisShoot.startClip = thisShoot.clipArray.find(function(o){ return o.utcTcStartMill == minUtcCrStartMillTs; })
  var minStartTs = Math.min.apply(Math,thisShoot.clipArray.map(function(o){return o.start_ts;}));
  thisShoot.tsStartClip = thisShoot.clipArray.find(function(o){ return o.start_ts == minStartTs; });
  var maxEndTs = Math.max.apply(Math,thisShoot.clipArray.map(function(o){return o.end_ts;}));
  thisShoot.firstMcAngle = thisShoot.startClip.cameraFolder;
  // TODO: change at some point to cope with clock-time differential.
  thisShoot.mcStartTc = thisShoot.startClip.startTc;
  thisShoot.mcStartTs = minStartTs;
  thisShoot.mcEndTs = maxEndTs;
  thisShoot.mcDuration = thisShoot.mcEndTs - thisShoot.mcStartTs;
  thisShoot.startCrDate = thisShoot.startClip.creationDate;
  thisShoot.startTcDate = thisShoot.startClip.utcTcStartDate;
  thisShoot.tcOffset = thisShoot.startTcDate.getTime() - thisShoot.startCrDate.getTime();
  thisShoot.tcFramesOffset = (thisShoot.tcOffset*24)/1001;
  notesFolderPath=("/" + path.join(folderPath, "_notes"));
  if (fs.existsSync(notesFolderPath)) {
  }
  else {
    fs.mkdirSync(notesFolderPath);
  }
  shootNotesName=(thisShoot.shootId + "_shootnotes.txt")
  shootNotesPath=path.join(folderPath, "_notes", shootNotesName)
  fs.appendFile(shootNotesPath, ("\n\n" + shootNotes), function (err) {
    if (err) {
      // console.log("didn't work");
    } else {
    }
  })
  return thisShoot;
}

module.exports.rename = rename;
