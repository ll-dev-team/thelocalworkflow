var request = require("request");
var moment = require("moment");

function TrelloCard(title, options){
  // Define as many attributes as have been passed in.
  // Default to placeholders or env variables.
  this.name = title;
  this.desc = options.desc ? options.desc : "no description";
  this.pos = options.pos ? options.pos : "top";
  this.due = options.due ? options.due : moment().endOf('day').fromNow().format("YYYY-MM-DD");
  this.members = options.members ? options.members : process.env.TRELLO_DEFAULT_MEMBER;
  this.key = options.key ? options.key : process.env.TRELLO_API_KEY_1;
  this.token = options.token ? options.token : process.env.TRELLO_TOKEN_1;
};

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
    url: 'https://api.trello.com/1/organizations/' + process.env.TRELLO_TEAM_1 + '/members',
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
    desc: 'sample description',
    pos: 'top',
    due: '2018-07-07',
    idList: process.env.SLACK_TRELLO_LIST,
    idMembers: process.env.TRELLO_MK_USER_ID,
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
module.exports.TrelloCard = TrelloCard;


// TODO: use this ultimately
// <script src="https://api.trello.com/1/client.js?key=1cd6ce7c5bb7d25e0334c0e1466968c6"></script>


// Get boards:
// GET /1/boards/tBmYPSYe?fields=id,name&lists=open&list_fields=id,name,closed,pos
