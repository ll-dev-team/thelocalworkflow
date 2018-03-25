var xArray = ["C300a", "C300b", "C300c"];
var yArray = ["dog", "cat", "C300a", "C300b"];

console.log(xArray);
console.log(yArray);

var zArray = yArray.filter(element => {
  return xArray.includes(element);
})

for (var i = 0; i < yArray.length; i++) {
  console.log(yArray[i]);
  console.log(xArray.includes(yArray[i]));
}

console.log(zArray);
