var columnify = require('columnify');
var fs = require('fs');
var shootprocessor = require("./mk_modules/shootprocessor");
var args = require("minimist")(process.argv.slice(2));

if (args.shootid){
    var date = shootprocessor.dateFromId(args.shootid);
    console.log("\n\n\n\nHello " + date.date + "\n\n\n\n");
}
