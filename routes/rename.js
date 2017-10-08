var express = require('express');
var router = express.Router();
require('dotenv').config();
var mongoose = require('mongoose');
const _ = require('lodash');
const m2s = require("../mk_modules/m2s").markersToStills;
// var Message = require('../models/message');

var db = mongoose.connection;

router.get('/', function(req, res, next) {
  // res.render('m2s_form', { tabTitle: 'm2s Entry Form', title: 'The m2s Form' });
  res.render('rename_form', { tabTitle: 'rename Entry Form', title: 'the Rename Form' })
});

router.post('/run_rename', function(req, res, next){
  console.log(req.body);
  res.render('rename_areusure', { tabTitle: 'rename confirmation', title: 'the Rename Form', folderPath: req.body.drive, reqBody: req.body })
});

router.post('/confirm_rename', function(req, res, next){
  console.log(req.body);
  res.send(req.body);
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
