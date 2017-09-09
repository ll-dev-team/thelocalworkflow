var files = [".dstore", ".ignore", "C300a", "C300b", "GH4"];

var cameras = files.filter(file => file !== ".dstore");

var reDot = /^\./

var testing = files.filter(file => !reDot.test(file));

files.forEach(function(file){
  console.log("file is " + file);
  var test = reDot.test(file);
  console.log(test);
});

console.log(files);
console.log(cameras);
console.log(testing);


var a = 0

a == 0 ? console.log(a + " is a") : {};
