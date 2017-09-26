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

router.get('/layout_001', function(req, res, next) {
    var theData = {array:[{firstName: "Marlon", lastName: "Kuzmick", title: "Director of the Learning Lab"}, {firstName: "Lauren", lastName: "Davidson", title: "Assistant Director of the Learning Lab"}, {firstName: "Katie", lastName: "Gilligan", title: "Learning Lab Project Manager"}, {firstName: "Noelle", lastName: "Lopez", title: "Learning Lab Postdoctoral Fellow"}], id: "001"}
    res.render('layout_001', { tabTitle: 'layout_001', title: 'Layout Test 1', data: theData });
  });

module.exports = router;




// /Users/mk/Development/test_materials/_readyToTest/20170909_001_Test_Shoot/_m2s/20170909_001_Test_Shoot_C300b_001_09220209.png
