
var Moment = require('../../models/moment');
var Person = require('../../models/person');
var Segment = require('../../models/segment');
var Shoot = require('../../models/shoot');
var Slate = require('../../models/slate');
var Clip = require('../../models/clip');
var async = require('async');


// Display list of all Authors
exports.index = function(req, res) {
  async.parallel({
       moment_count: function(callback) {
           Moment.count(callback);
       },
       shoot_count: function(callback) {
           Shoot.count(callback);
       },
       person_count: function(callback) {
           Person.count(callback);
       },
       segment_count: function(callback) {
           Segment.count(callback);
       },
       slate_count: function(callback) {
           Slate.count(callback);
       },
       clip_count: function(callback) {
           Clip.count(callback);
       }
   }, function(err, results) {
        if (err) {
          console.log(err);
        }
        JSON.stringify(results);
        res.render('database/overview', {title: "the Database", tabTitle: "theDatabase", data: results});
   });
};



// {shoot: "20171218_001_Test_Shoot", people: ["Marlon", "Katie", "Casey", "Moira", "Sadikshya"]}
