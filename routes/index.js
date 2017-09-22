var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { tabTitle: 'history-machine', title: 'The Slack History Machine' });
});

module.exports = router;
