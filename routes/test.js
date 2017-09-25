var express = require('express');
var router = express.Router();
require('dotenv').config();

router.get('/', function(req, res, next) {
    var theChannels = ['channel 1', 'channel 2', 'channel 3']
    res.render('testform', { tabTitle: 'history-machine', title: 'The Slack History Machine', channels: theChannels });
  });

router.post('/testresult', function(req, res, next){
  console.log(JSON.stringify(req.body));
  res.render('testresult', { tabTitle: 'history-machine', title: 'The Slack History Machine', result: "0"});
});

module.exports = router;




// /Users/mk/Development/test_materials/_readyToTest/20170909_001_Test_Shoot/_m2s/20170909_001_Test_Shoot_C300b_001_09220209.png
