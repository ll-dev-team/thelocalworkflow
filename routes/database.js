var express = require('express');
var router = express.Router();

// Require controller modules
var shoot_controller = require('../controllers/the_database/shootController');
var person_controller = require('../controllers/the_database/personController');
var moment_controller = require('../controllers/the_database/momentController');
var segment_controller = require('../controllers/the_database/segmentController');
var database_controller = require('../controllers/the_database/databaseController');
var Person = require('../models/person');

/// BOOK ROUTES ///

/* GET catalog home page. */
router.get('/',
// (req, res)=>{res.send('database index will go here');}
database_controller.index
);

/* GET request for creating a Book. NOTE This must come before routes that display Book (uses id) */
router.get('/shoot/create', shoot_controller.shoot_create_get);

/* POST request for creating Book. */
router.post('/shoot/create', shoot_controller.shoot_create_post);

/* GET request to delete Book. */
router.get('/shoot/:id/delete', shoot_controller.shoot_delete_get);

// POST request to delete Book
router.post('/shoot/:id/delete', shoot_controller.shoot_delete_post);

/* GET request to update Book. */
router.get('/shoot/:id/update', shoot_controller.shoot_update_get);

// POST request to update Book
router.post('/shoot/:id/update', shoot_controller.shoot_update_post);

/* GET request for one Book. */
router.get('/shoot/:id', shoot_controller.shoot_detail);

/* GET request for list of all Book items. */
router.get('/shoots', shoot_controller.shoot_list);

/// person ROUTES ///

/* GET request for creating person. NOTE This must come before route for id (i.e. display person) */
router.get('/person/create', person_controller.person_create_get);

/* POST request for creating person. */
router.post('/person/create', person_controller.person_create_post);

/* GET request to delete person. */
router.get('/person/:id/delete', person_controller.person_delete_get);

// POST request to delete person
router.post('/person/:id/delete', person_controller.person_delete_post);

/* GET request to update person. */
router.get('/person/:id/update', person_controller.person_update_get);

// POST request to update person
router.post('/person/:id/update', person_controller.person_update_post);

/* GET request for one person. */
router.get('/person/:id', person_controller.person_detail);

// router.get('/person/:id', (req, res, next)=>{
//   Person.findById(req.params.id, (err, result)=> {
//     console.log(JSON.stringify(result, null, 4));
//     res.render('database/person_detail', { title: 'Person Detail', tabTitle: 'Person Detail', thePerson: result})
//   });
// });

/* GET request for list of all persons. */
router.get('/people', person_controller.person_list);

/// moment ROUTES ///

/* GET request for creating a segment. NOTE This must come before route that displays segment (uses id) */
router.get('/segment/create', segment_controller.segment_create_get);

/* POST request for creating segment. */
router.post('/segment/create', segment_controller.segment_create_post);

/* GET request to delete segment. */
router.get('/segment/:id/delete', segment_controller.segment_delete_get);

// POST request to delete segment
router.post('/segment/:id/delete', segment_controller.segment_delete_post);

/* GET request to update segment. */
router.get('/segment/:id/update', segment_controller.segment_update_get);

// POST request to update segment
router.post('/segment/:id/update', segment_controller.segment_update_post);

/* GET request for one segment. */
router.get('/segment/:id', segment_controller.segment_detail);

/* GET request for list of all segment. */
router.get('/segments', segment_controller.segment_list);




router.get('/moment/create', moment_controller.moment_create_get);

/* POST request for creating moment. */
router.post('/moment/create', moment_controller.moment_create_post);

/* GET request to delete moment. */
router.get('/moment/:id/delete', moment_controller.moment_delete_get);

// POST request to delete moment
router.post('/moment/:id/delete', moment_controller.moment_delete_post);

/* GET request to update moment. */
router.get('/moment/:id/update', moment_controller.moment_update_get);

// POST request to update moment
router.post('/moment/:id/update', moment_controller.moment_update_post);

/* GET request for one moment. */
router.get('/moment/:id', moment_controller.moment_detail);

/* GET request for list of all moment. */
router.get('/moments', moment_controller.moment_list);

/// BOOKINSTANCE ROUTES ///

module.exports = router;
