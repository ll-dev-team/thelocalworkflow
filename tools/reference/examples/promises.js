
async function resolveAfter2Seconds() {
  console.log("in resolveAfter2Seconds");
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 500);
  });
}



async function resolveAfterRandomSeconds(theDelay, cumulative) {
  console.log("in resolveAfterRandomSeconds");
  return new Promise(resolve => {
    console.log("delay is " + theDelay);
    var theNewDelay = theDelay*1000;
    setTimeout(() => {
      resolve('resolved after ' + theDelay + " seconds.  The cumulative delay is " + cumulative + " seconds.");
    }, theNewDelay);
  });
}
