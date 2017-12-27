var express = require('express');
var router = express.Router();
require('dotenv').config();

router.get('/', function(req, res, next) {
  res.render('tools/theworkflow', { tabTitle: 'theworkflow', title: 'The Workflow Machine' });
});

router.post('/shootinfo', function(req, res, next){
  console.log("test");
  // do mongo work
  res.render('tools/shootinfo', { tabTitle: 'Shoot Info', title: 'Shoot Info Machine'});
});

module.exports = router;
