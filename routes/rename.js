var express = require('express');
var router = express.Router();
require('dotenv').config();
var mongoose = require('mongoose');
const fcpxml = require("../ll_modules/fcpxml");
const fs = require('fs');
const cp = require('child_process');
const _ = require('lodash');
const m2s = require("../ll_modules/m2s").markersToStills;
const rename = require("../ll_modules/shootprocessor").rename;
// var Message = require('../models/message');

var db = mongoose.connection;

router.get('/', function(req, res, next) {
  // send the rename form to the user.
  res.render('rename_form', { tabTitle: 'rename Entry Form', title: 'the Rename Form' })
});

router.post('/run_rename', function(req, res, next){
  // user sends filled form back to server
  // log JSON for response
  console.log("initial form req.body: \n" + JSON.stringify(req.body, null, 5));
  // render the are you sure page, sending key data to client that needs to be sent back to server again
  // TODO: need to do a better job of handing this data over and getting it back.
  res.render('rename_areusure', { tabTitle: 'rename confirmation', title: 'the Rename Form', folderPath: req.body.folderPath, people: req.body.people  })
});

router.post('/confirm_rename', function(req, res, next){
  // TODO: get the confirmation back with the shootpath and the additional data for the shoot.
  console.log(JSON.stringify(req.body));
  theText = JSON.stringify(req.body);
  console.log("the text is " + theText);
  // TODO: send to mLab
  // TODO: render confirmation response
  if (req.body.confirmation=="no") {
    res.redirect("/rename");
  }
  else {
    var theResult = rename(req.body.folderPath);
    var theResourceXml = fcpxml.makeFcpxml(theResult);
    console.log("\n\ncomplete________________________________________________\n\n");
    var pathForJson = (theResult.shootPath + "/_notes/" + theResult.shootId + "_shootObject.json");
    var shootObjectJson = JSON.stringify(theResult, null, 2);
    fs.writeFileSync(pathForJson, shootObjectJson);
    var thePayload = 'payload={"channel": "#ll-tests", "username": "theworkflow-bot", "text": "<@marlon>: the shoot with id ' + theResult.shootId + ' has been ingested and renamed.", "icon_emoji": ":desktop_computer:"}'
    cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);

    // MongoClient.connect(process.env.MONGODB_PATH, function(err, db) {
    //   assert.equal(null, err);
    //   console.log("Connected successfully to server");
    //   // console.log(JSON.stringify(theResult, null, 4));
    //   db.collection('shoots').insertOne({theResult});
    //   db.close();
    // });
    console.log("\n\ndone.\n");









    res.render('rename_complete', {tabTitle: 'Rename Complete', title: 'Rename Done', reqbody: req.body})
  }
  res.send(theText);
  // res.render('rename_form', { tabTitle: 'rename confirmation', title: 'the Rename Form', folderPath: req.body.drive })

});

//
// router.get('/test', function(req, res, next) {
//   res.render('m2s_form', { tabTitle: 'test here', title: 'The m2s test Form' });
// });
//
//
// router.post('/run_m2s', function(req, res, next){
//   console.log(JSON.stringify(req.body, null, 4));
//   if (req.body.webexport == "yes") {
//     var folderPath = "/Users/mk/Development/test_materials/_readyToTest/m2s_fcpxml";
//     var theResult = m2s(folderPath);
//     var theNewResult = _.sortBy(theResult, ['tcNumber']);
//     res.render('m2s_result', { tabTitle: 'm2s Result', title: 'The m2s Result for ', stillArray: theNewResult });
//   }
//   else {
//     res.send('why did you bother opening up thelocalworkflow then?')
//   }
// });


module.exports = router;
