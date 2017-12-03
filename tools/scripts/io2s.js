
// require shootprocessor?
// loop through all

function io2s(ioJson){
  console.log(ioJson);
  ioJson.forEach((segment)=>{
    console.log("first segment in point is " + segment.inHr + ":" + segment.inMin + ":" + segment.inSec + ":" + segment.inFrame);
    
  })
}

module.exports.io2s = io2s;
