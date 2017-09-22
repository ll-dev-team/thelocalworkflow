var express = require('express');
var router = express.Router();
require('dotenv').config();

router.get('/', function(req, res, next) {
  res.render('theworkflow', { tabTitle: 'theworkflow', title: 'The Workflow Machine' });
});

router.post('/shootinfo', function(req, res, next){
  console.log("test");
  // do mongo work
  res.render('shootinfo', { tabTitle: 'Shoot Info', title: 'Shoot Info Machine'});
});
//
// router.post('/', function(req, res, next){
//   console.log("test");
//   slack.channels.history({token: token, channel: "C6AAGUS6T", count: 10}, (err, data) => {
//     // console.log(JSON.stringify(data, null, 10));
//     // console.log(req.body.key1);
//     // var dataObject = JSON.parse(data);
//     data.messages.forEach(datum => {console.log(datum.text);})
//     res.send('received ' + JSON.stringify(req.body) + "\ngoodbye.\n\n\n")
//   });
// });

// router.get('/slackhistory', function(req, res, next) {
//   res.send('this is just for post requests')});
// });

module.exports = router;
