function rename(filename, cb) {
  fs.renameSync(oldPath, newPath)
  // fs.readFile(filename, 'utf-8', function(err,contents){
  //   if (err) {
  //     cb(err);
  //   }
  //   else {
  //     setTimeout(function(){
  //       cb(null,contents);
  //     },2000);
  //   }
  // });
}

var fs = require("fs");

module.exports.rename = rename;
