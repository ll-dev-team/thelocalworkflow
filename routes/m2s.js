var express = require('express');
var router = express.Router();
require('dotenv').config();
var mongoose = require('mongoose');
const _ = require('lodash');
const m2s = require("../ll_modules/m2s").markersToStills;
const m2sf = require("../ll_modules/m2s").fcpxmlFileToStills;
// var Message = require('../models/message');

var db = mongoose.connection;

router.get('/', function(req, res, next) {
  var folderPath = "/Users/mk/Development/test_materials/_readyToTest/m2s_fcpxml";
  res.render('m2s_form', { tabTitle: 'm2s Entry Form', title: 'The m2s Form', theFolderPath: folderPath });
});


router.get('/test', function(req, res, next) {
  res.render('m2s_form', { tabTitle: 'test here', title: 'The m2s test Form' });
});


router.post('/run_m2s', function(req, res, next){
  console.log(JSON.stringify(req.body, null, 4));
  if (req.body.webexport == "yes") {
    // var folderPath = "/Users/mk/Development/test_materials/_readyToTest/m2s_fcpxml";
    // var theResult = m2s(folderPath);
    var folderPath = req.body.fcpxmlPath;
    var theResult = m2sf(req.body.fcpxmlPath);
    var theNewResult = _.sortBy(theResult, ['tcNumber']);
    res.render('m2s_result', { tabTitle: 'm2s Result', title: 'The m2s Result for ', stillArray: theNewResult, theFolderPath: folderPath });
  }
  else {
    res.send('why did you bother opening up thelocalworkflow then?')
  }
});


module.exports = router;
