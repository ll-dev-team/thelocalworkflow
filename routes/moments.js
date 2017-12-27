var express = require('express');
var router = express.Router();
require('dotenv').config();
var mongoose = require('mongoose');
var momentController = require('../controllers/the_database/momentcontroller');
// var Message = require('../models/message');

var db = mongoose.connection;

router.get('/', function(req, res, next) {
  res.render('database/momentform', { tabTitle: 'Moment Entry Form', title: 'The Manual Moment Form' });
});
//
// router.post('/submitmoment', function(req, res, next){
//   console.log("submitting moment to DB");
//   console.log(req.body);
//   res.render('momentsubmitted', { tabTitle: 'Moment Machine', title: 'Moment Submitted', reqbody: req.body});
// });


router.post('/submitmoment', momentController.moment_create)


module.exports = router;
