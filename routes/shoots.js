var express = require('express');
var router = express.Router();
require('dotenv').config();
var mongoose = require('mongoose');
const async = require('async');

var db = mongoose.connection;

router.get('/', function(req, res, next) {
  var theResult = ["results", "and more results", "probably lots"];
  res.render('tools/shoots_list', { tabTitle: 'LL Shoots', title: 'LL Shoots List', result: theResult })
});

router.post('/selectshoot', function(req, res, next){
  console.log("test");
    res.send('received ' + JSON.stringify(req.body) + "\ngoodbye.\n\n\n")
  });

router.get('/:shootId', function(req, res, next) {
  res.render('tools/shootinfo', { tabTitle: ('Info on ' + req.params.shootId), title: ('Details on ' + req.params.shootId), shootId: req.params.shootId })
});

// router.get('/slackhistory', function(req, res, next) {
//   res.send('this is just for post requests')});
// });

module.exports = router;
