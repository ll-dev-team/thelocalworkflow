var x = {$:{prop1:"a property", prop2:"not a color"}, color: "black"};
console.log(JSON.stringify(x));
x._attr = x.$
console.log(JSON.stringify(x));
delete x.$
console.log(JSON.stringify(x));
