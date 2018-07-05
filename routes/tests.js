var express = require('express');
var router = express.Router();
var Shoot = require('../models/shoot');
var async = require('async');
var pd = require('pretty-data').pd;
require('dotenv').config();
const parseXmlString = require('xml2js').parseString;

router.get('/', function(req, res, next) {
    var theChannels = ['channel 1', 'channel 2', 'channel 3']
    res.render('tests/testform', { tabTitle: 'history-machine', title: 'The Slack History Machine', channels: theChannels });
  });

router.get('/mongo1', function(req, res, next) {
    Shoot.find({})
      .select('shootId _id theResult.shootPath')
      .sort('-_id')
      .limit(10)
      .exec(function (err, list_shoots) {
        if (err) { return next(err); }
        console.log(JSON.stringify(list_shoots, null, 4));
        res.render('database/shoot_list', { title: 'Shoot List', tabTitle: "Shoot List",
        shoot_list: list_shoots
        // shoot_list: [
        //     {
        //       _id: "a",
        //       shootId: "20180702_001_Test_Id"
        //     },
        //   ]
        }
      );
      });
})


router.get('/mongo2', function(req, res, next) {
    async.parallel({
        shoot: function(callback) {
                Shoot.findById("5aff179c88151611c52c8154")
                  .exec(callback);
            }
        // ,
        // shoot_stills: function(callback) {
        //   Still.find({ 'shoot_id': req.params.id })
        //   .exec(callback);
        // },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.shoot==null) { // No results.
                var err = new Error('Shoot not found');
                err.status = 404;
                return next(err);
            }
            if (results.shoot.fcpxml) {
              res.render('database/shoot_detail', { title: 'Shoot Detail', tabTitle: 'Shoot Detail', theShoot: results.shoot, prettyFcpxml: (pd.xml(results.shoot.fcpxml))})
            }
            else {
              res.render('database/shoot_detail', { title: 'Shoot Detail', tabTitle: 'Shoot Detail', theShoot: results.shoot, prettyFcpxml: "no .fcpxml file for this shoot"})
            }
          });
        });



router.post('/testresult', function(req, res, next){
  console.log(JSON.stringify(req.body));
  res.render('tests/testresult', { tabTitle: 'testResult', title: 'The Test Result', result: ["0", "dog", "cat"]});
});

router.get('/layout_001', function(req, res, next) {
    var theData = {array:[{firstName: "Marlon", lastName: "Kuzmick", title: "Director of the Learning Lab"}, {firstName: "Lauren", lastName: "Davidson", title: "Assistant Director of the Learning Lab"}, {firstName: "Katie", lastName: "Gilligan", title: "Learning Lab Project Manager"}, {firstName: "Noelle", lastName: "Lopez", title: "Learning Lab Postdoctoral Fellow"}], id: "001"}
    res.render('tests/layout_001', { tabTitle: 'layout_001', title: 'Layout Test 1', data: theData });
  });

router.get('/jquery_forms', function(req, res, next) {
    res.render('tests/jquery_forms', { tabTitle: 'layout_001', title: 'Layout Test 1' });
  });

router.get('/testjs', function(req, res, next) {
    var theData = {array:[{firstName: "Marlon", lastName: "Kuzmick", title: "Director of the Learning Lab"}, {firstName: "Lauren", lastName: "Davidson", title: "Assistant Director of the Learning Lab"}, {firstName: "Katie", lastName: "Gilligan", title: "Learning Lab Project Manager"}, {firstName: "Noelle", lastName: "Lopez", title: "Learning Lab Postdoctoral Fellow"}], id: "001"}
    res.render('tests/testjs', { tabTitle: 'testjs', title: 'test js', data: theData });
  });

router.get('/clock', function(req, res, next) {
    var theData = {array:[{firstName: "Marlon", lastName: "Kuzmick", title: "Director of the Learning Lab"}, {firstName: "Lauren", lastName: "Davidson", title: "Assistant Director of the Learning Lab"}, {firstName: "Katie", lastName: "Gilligan", title: "Learning Lab Project Manager"}, {firstName: "Noelle", lastName: "Lopez", title: "Learning Lab Postdoctoral Fellow"}], id: "001"}
    res.render('tests/clock', { tabTitle: 'clock', title: 'js clock', data: theData });
  });

router.get('/rollover', function(req, res) {
  res.render('tests/rollover', {title:"Rollover Test", tabTitle: "Rollover Test"});
});

module.exports = router;




// /Users/mk/Development/test_materials/_readyToTest/20170909_001_Test_Shoot/_m2s/20170909_001_Test_Shoot_C300b_001_09220209.png
