var request = require("request");


function getLists(board){
  var options = { method: 'GET',
    url: ('https://api.trello.com/1/boards/' + board + '/lists'),
    qs:
     { key: process.env.TRELLO_API_KEY_1,
       token: process.env.TRELLO_TOKEN_1 } };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    var resultObject = JSON.parse(body);
    console.log(JSON.stringify(resultObject, null, 4));
  });
}

function getMembers(){
  var options = {
    method: 'GET',
    url: 'https://api.trello.com/1/organizations/testteam44908619/members',
    qs: {key: process.env.TRELLO_API_KEY_1,
    token: process.env.TRELLO_TOKEN_1}
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    var resultObject = JSON.parse(body);
    console.log(JSON.stringify(resultObject, null, 4));
  });
}

function postTest(message){
  var element = {
    key: process.env.TRELLO_API_KEY_1,
    token: process.env.TRELLO_TOKEN_1,
    name: 'A sample card',
    desc: 'This card could have come from slack.  If I put a URL what happens? https://www.apple.com \nthat\'s a new line. \n' + message,
    pos: 'top',
    due: '2018-07-07',
    idList: process.env.SLACK_TRELLO_LIST,
    idMembers: '5b3d2a075c2659b84a66ce4b',
    // idLabels: 'shouldBeLabels',
    urlSource: 'https://codelab.learninglab.xyz',
    keepFromSource: 'all' };
  postToList(element, process.env.SLACK_TRELLO_LIST);
}

function postToList(element, list){
  console.log("going to try to post an element to ll-autobot Trello Board:\n" + JSON.stringify(element, null, 4));
  var options = { method: 'POST',
    url: 'https://api.trello.com/1/cards',
    qs: element};
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
  });
}

module.exports.postTest = postTest;
module.exports.getLists = getLists;
module.exports.getMembers = getMembers;


// TODO: use this ultimately
// <script src="https://api.trello.com/1/client.js?key=1cd6ce7c5bb7d25e0334c0e1466968c6"></script>


// Get boards:
// GET /1/boards/tBmYPSYe?fields=id,name&lists=open&list_fields=id,name,closed,pos
