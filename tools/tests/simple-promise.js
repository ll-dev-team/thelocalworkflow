function logTimecode(path) {
  // getAllData(path)
  //   .then((data)=>{console.log("\n\ngot your data:\n\n"+JSON.stringify(data, null, 4)+"\n\nso basically it worked.\n\n")})
  //   .catch(err=>{console.log("there was an error\n\n" + err + "\n\n")});
  simplePromiseTest(path)
    .then(data=>{console.log(data)})
    .catch(err=>{console.log(err)});
}

function simplePromiseTest(path) {
  return new Promise(function(resolve, reject){
    var data = ffprobeSync(path);
    if (data) {
      resolve(data);
    }
    else {
      reject(Error("It broke"));
    }
  })
}
