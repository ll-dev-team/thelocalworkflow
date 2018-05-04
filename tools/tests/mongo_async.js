const fs = require('fs');
const Fcpxml = require('../../models/fcpxml');
const path = require('path');
var mongoose = require('mongoose');
const options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};


async function checkMongo(shootId) {
  return new Promise(resolve => {
    Fcpxml.find({'shootId': shootId}, function(err, data){
      // console.log("\n\nfound this data: \n\n" + JSON.stringify(data, null, 4));
      if (data.length == 0) {
        resolve({shootId: shootId, fcpxml: ("nothing here for " + shootId)} )
      }
      if (data.length == 1) {
        resolve({shootId: shootId, fcpxml: data[0].fcpxml});
      }
      else {
        resolve("working on this part.")
      }
    })
  });

}

async function asyncCall() {
  console.log(process.env.MONGODB_URL);
  mongoose.connect(process.env.MONGODB_URL, options, (err)=>{
    if (err) {
      throw err;
    }
    else {
      console.log("you are connected");
    }});
  var shootArray = ["20171203_003_MCB81_Indecisives", "20171204_003_Report_MKinterview", "20171205_002_AIE_BCD", "asdfasdfas"];
  var theXmls = [];
  for (var i = 0; i < shootArray.length; i++) {
    var tempResult = await checkMongo(shootArray[i]);
    theXmls.push(tempResult);
  };
  console.log("\n\nhere is your result: \n" + JSON.stringify(theXmls, null, 4));
  mongoose.connection.close();
}


module.exports.asyncTest = asyncCall;
