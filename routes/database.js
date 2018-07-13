var express = require('express');
var router = express.Router();

var shoot_controller = require('../controllers/the_database/shootController');
var person_controller = require('../controllers/the_database/personController');
var moment_controller = require('../controllers/the_database/momentController');
var segment_controller = require('../controllers/the_database/segmentController');
var database_controller = require('../controllers/the_database/databaseController');
var Person = require('../models/person');
var slate_controller = require('../controllers/the_database/slate_controller');
var clip_controller = require('../controllers/the_database/clip_controller');


router.get('/', database_controller.index);

router.get('/shoot/create', shoot_controller.shoot_create_get);

router.post('/shoot/create', shoot_controller.shoot_create_post);

router.get('/shoot/:id/delete', shoot_controller.shoot_delete_get);

router.post('/shoot/:id/delete', shoot_controller.shoot_delete_post);

router.get('/shoot/:id/update', shoot_controller.shoot_update_get);

router.post('/shoot/:id/update', shoot_controller.shoot_update_post);

router.get('/shoot/:id/stills', shoot_controller.shoot_stills_get);

router.get('/shoot/:id/fcpxml', shoot_controller.shoot_fcpxml_get);

router.get('/shoot/:id/json', shoot_controller.shoot_json_get);

router.get('/shoot/:id', shoot_controller.shoot_detail);

router.get('/shoots', shoot_controller.shoot_list);

router.get('/person/create', person_controller.person_create_get);

router.post('/person/create', person_controller.person_create_post);

router.get('/person/:id/delete', person_controller.person_delete_get);

router.post('/person/:id/delete', person_controller.person_delete_post);

router.get('/person/:id/update', person_controller.person_update_get);

router.post('/person/:id/update', person_controller.person_update_post);

router.get('/person/:id', person_controller.person_detail);

router.get('/people', person_controller.person_list);

router.get('/segment/create/csv', segment_controller.segment_create_csv_get);

router.get('/segment/create/manual', segment_controller.segment_create_manual_get);

router.get('/segment/create', segment_controller.segment_create_get);

router.post('/segment/create', segment_controller.segment_create_post);

router.get('/segment/:id/delete', segment_controller.segment_delete_get);

router.post('/segment/:id/delete', segment_controller.segment_delete_post);

router.get('/segment/:id/update', segment_controller.segment_update_get);

router.post('/segment/:id/update', segment_controller.segment_update_post);

router.get('/segment/:id', segment_controller.segment_detail);

router.get('/segments', segment_controller.segment_list);

router.get('/moment/create', moment_controller.moment_create_get);

router.post('/moment/create', moment_controller.moment_create_post);

router.get('/moment/:id/delete', moment_controller.moment_delete_get);

router.post('/moment/:id/delete', moment_controller.moment_delete_post);

router.get('/moment/:id/update', moment_controller.moment_update_get);

router.post('/moment/:id/update', moment_controller.moment_update_post);

router.get('/moment/:id', moment_controller.moment_detail);

router.get('/moments', moment_controller.moment_list);

router.get('/slate/create', slate_controller.slate_create_get);

router.get('/slate/manual', slate_controller.slate_create_manual_get);

router.post('/slate/create', slate_controller.slate_create_post);

router.post('/slate/manual', slate_controller.slate_create_manual_post);

router.get('/slate/:id/delete', slate_controller.slate_delete_get);

router.post('/slate/:id/delete', slate_controller.slate_delete_post);

router.get('/slate/:id/update', slate_controller.slate_update_get);

router.post('/slate/:id/update', slate_controller.slate_update_post);

router.get('/slate/:id', slate_controller.slate_detail);

router.get('/slates', slate_controller.slate_list);

router.get('/clip/create', clip_controller.clip_create_get);

router.get('/clip/manual', clip_controller.clip_create_manual_get);

router.post('/clip/create', clip_controller.clip_create_post);

router.post('/clip/manual', clip_controller.clip_create_manual_post);

router.get('/clip/:id/delete', clip_controller.clip_delete_get);

router.post('/clip/:id/delete', clip_controller.clip_delete_post);

router.get('/clip/:id/update', clip_controller.clip_update_get);

router.post('/clip/:id/update', clip_controller.clip_update_post);

router.get('/clip/:ll_id', clip_controller.clip_detail_ll_id);

router.get('/clips', clip_controller.clip_list);

module.exports = router;
