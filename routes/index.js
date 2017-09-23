var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { tabTitle: 'thelocalworkflow', title: 'The Local Workflow' });
});

module.exports = router;
