function say(filename, cb) {
  return fs.readFile(filename, 'utf-8', function(err,contents){
    if (err) {
      cb(err);
    }
    else {
      setTimeout(function(){
        cb(null,contents);
      },2000);
    }
  });
}

var fs = require("fs");

module.exports.say = say;







//
// function say(filename, cb) {
//   return fs.readFile(filename, 'utf-8', cb);
// }
//
// var fs = require("fs");
//
// module.exports.say = say;
