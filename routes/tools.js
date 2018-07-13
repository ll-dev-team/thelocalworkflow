var express = require('express');
var router = express.Router();
var tc2clock_controller = require('../controllers/tools/tc2clock_controller');
var ffprobe_controller = require('../controllers/tools/ffprobe_controller');

router.get('/', function(req, res, next){
  res.send("tools menu coming");
});

router.get('/tc2clock',
  tc2clock_controller.tc2clock_get
);

router.post('/tc2clock', tc2clock_controller.tc2clock_post);

router.get('/clock2tc', tc2clock_controller.clock2tc_get);

router.post('/clock2tc', tc2clock_controller.clock2tc_post);

router.get('/ffprobe', ffprobe_controller.ffprobe_get);

router.post('/ffprobe', ffprobe_controller.ffprobe_post);

module.exports = router;
