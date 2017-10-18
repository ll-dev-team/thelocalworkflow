var dirComp = require('dir-compare');
var options = {compareSize: true, ignoreCase: true, excludeFilter: ".*"};
var minimatch = require('minimatch')
const cp = require("child_process");
const path = require("path")
var slack = require('slack');
require('dotenv').config();
var token = process.env.SLACK_TOKEN;

var directories = process.argv.slice(2);
 var dirPath1 = directories[0];
 var dirPath2 = directories[1];


var res = dirComp.compareSync(dirPath1, dirPath2, options);
console.log('\nFile Matches: ' + res.equal);
console.log('File Mismatches: ' + res.distinct);
console.log('Files Missing ' + dirPath1 + ': ' + res.right);
console.log('Files Missing ' + dirPath2 + ': ' + res.left);
console.log('Total Issues: ' + res.differences);

if (res.same==true){

  var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "<@laurend>: Directories:' + dirPath1 + ' and ' + dirPath2 + ' match. ", "icon_emoji": ":desktop_computer:"}'
  cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);

  console.log('\n\n Directories match!');

}

else {

  var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "<@laurend>: Directories:' + dirPath1 + ' and ' + dirPath2 + ' do not match. ", "icon_emoji": ":desktop_computer:"}'
  cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);

  var format = require('util').format;

  res.diffSet.forEach(function (entry) {
      var state = {
          'equal' : '==',
          'left' : '->',
          'right' : '<-',
          'distinct' : '<>'
      }[entry.state];

      if (entry.state=='left') {

        var name1 = entry.name1 ? entry.name1 : '';

        var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "The file '+ name1 +' is missing from ' + dirPath2 +' .", "icon_emoji": ":desktop_computer:"}'
        cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);
      }

      if (entry.state=='right') {

        var name1 = entry.name1 ? entry.name1 : '';

        var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "The file '+ name1 +' is missing from ' + dirPath1 +' .", "icon_emoji": ":desktop_computer:"}'
        cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);
      }

      if (entry.state=='distinct') {

        var name1 = entry.name1 ? entry.name1 : '';

        var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "There is a discrepancy between files named '+ name1 +'.", "icon_emoji": ":desktop_computer:"}'
        cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);
      }

  });

    console.log('\nFiles to fix sent to Slack.');
}
