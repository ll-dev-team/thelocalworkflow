var express = require('express');
var router = express.Router();
var slack = require('slack');
const fs = require('fs');
require('dotenv').config();
var token = process.env.SLACK_TOKEN;
var mongoose = require('mongoose');
const async = require('async');
// const MongoClient = require("mongodb").MongoClient, assert = require('assert');

// var Message = require('../models/message');

var db = mongoose.connection;

function arrayToMongo(array, collection){
  // db.connect(process.env.MONGODB_PATH, function(err, db) {
  //   assert.equal(null, err);
    array.forEach(function(element){
      var testElement = db.collection(collection).findOne
      if (true) {

      }
      db.collection(collection).insertOne(element);
    });
    // db.close();
    // });
  };

router.get('/', function(req, res, next) {
  // var theChannels = ['67iutkf', 'go8t', '87ifm'];
  slack.channels.list({token: token}, (err, data) => {
    console.log(data);
    // console.log("the length of data is " + data.length);
    var theChannels = data.channels;
    res.render('slack/slack', { tabTitle: 'history-machine', title: 'The Slack History Machine', channels: theChannels });
  });
});



router.get('/invideo', function(req, res, next){
  res.render('slack/invideo_form', { tabTitle: 'Slack in Video', title: 'The Slack in Video Machine'})
});

router.post('/make_segment', function(req, res, next){
  res.send("not quite there yet.  check back soon.\n\nIn the meantime, here's your JSON:\n\n" + JSON.stringify(req.body, null, 4));
});

router.get('/channels', function(req, res, next){
  var theResult = ['x1', 'x2', 'x3', 'x4'];
  res.render('slack/channels', { tabTitle: 'history-machine', title: 'The Slack History Machine', result: theResult })
});

router.post('/history', function(req, res, next){
  var channelName = req.body.channel.split(".")[1];
  slack.channels.history({token: token, channel: req.body.channel.split(".")[0], count: 200}, (err, data) => {
    // console.log(JSON.stringify(data, null, 10));
    // console.log(req.body.key1);
    // var dataObject = JSON.parse(data);
    var theResult = [];
    console.log(data);
    data.messages.forEach(datum => {
        theResult.push(datum.text);
      });
    res.render('slack/history', { tabTitle: 'history-machine', title: 'The Slack History Machine', channelName : req.body.channel.split(".")[1], result: theResult });
  });
});

router.get('/sync_users', function(req, res, next){
  res.render('slack/sync_user_form', { tabTitle: 'Sync Users', title: 'Sync Users'});
});

router.post('/sync_users', function(req, res, next){
  if (req.body.sync == "yes") {
      slack.users.list({token: token}, (err, data) => {
        console.log(JSON.stringify(data, null, 8));
        fs.writeFileSync('/Users/mk/Development/_tests/slack/users.json', JSON.stringify(data, null, 2));
        // TODO: write json out to db
        arrayToMongo(data.members, 'users');
        res.render('slack/sync_user_result', { tabTitle: 'Sync Users Result', title: 'Sync Users Result', result: data});
      });
  }
  else {
      res.render('slack/basic_result', { tabTitle: 'Sync Users Result', title: 'Sync Users Result', result: "no result"});
  }

});

module.exports = router;
