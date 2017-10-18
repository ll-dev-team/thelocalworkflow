var slack = require('slack');
require('dotenv').config();
var token = process.env.SLACK_TOKEN;

function getSlackHistory(){


};

slack.channels.history({token: token, channel: "C6AAGUS6T", count: 10}, (err, data) => {
  data.messages.forEach(datum => {console.log(datum.text);})
});

module.exports.getSlackHistory = getSlackHistory;
