var Shoot = require('../../models/shoot');
var async = require('async');
var fs = require ('fs');
var pd = require('pretty-data').pd;
const parseXmlString = require('xml2js').parseString;

exports.shoot_list = function(req, res, next) {
    Shoot.find({})
      .select('shootId _id theResult.shootPath')
      .sort('shootId')
      .limit(100)
      .exec(function (err, list_shoots) {
        if (err) { return next(err); }
        console.log(JSON.stringify(list_shoots, null, 4));
        res.render('database/shoot_list', { title: 'Shoot List', tabTitle: "Shoot List",
        shoot_list: list_shoots
        // shoot_list: [
        //     {
        //       _id: "a",
        //       shootId: "20180702_001_Test_Id"
        //     },
        //   ]
        }
      );
      });
}

exports.shoot_detail = function(req, res, next) {
    async.parallel({
        shoot: function(callback) {
                Shoot.findById(req.params.id)
                  .exec(callback);
            }
        // ,
        // shoot_stills: function(callback) {
        //   Still.find({ 'shoot_id': req.params.id })
        //   .exec(callback);
        // },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.shoot==null) { // No results.
                var err = new Error('Shoot not found');
                err.status = 404;
                return next(err);
            }
            if (results.shoot.fcpxml) {
              res.render('database/shoot_detail', { title: 'Shoot Detail', tabTitle: 'Shoot Detail', theShoot: results.shoot, prettyFcpxml: (pd.xml(results.shoot.fcpxml))})
            }
            else {
              res.render('database/shoot_detail', { title: 'Shoot Detail', tabTitle: 'Shoot Detail', theShoot: results.shoot, prettyFcpxml: "no .fcpxml file for this shoot.\nNeed to get the data structure sorted!"})
            }
        })
    }

exports.shoot_create_get = function(req, res) {
    res.render('database/shoot_create', { title: 'Create Shoot', tabTitle: "Create Shoot", errors: null});
};

exports.shoot_create_post = function(req, res, next) {
    console.log("just got a post request:\n" + JSON.stringify(req.body, null, 4));
    // req.checkBody('shootId', 'Shoot ID required').notEmpty();
    req.checkBody('shootId', 'Shoot ID required.').notEmpty();
    req.checkBody('fcpxml', 'Fcpxml required.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('people', 'People required.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.sanitize('shootId').escape();
    req.sanitize('shootId').trim();
    // req.sanitize('fcpxml').escape();
    req.sanitize('fcpxml').trim();
    req.sanitize('people').escape();
    req.sanitize('people').trim();
    var errors = req.validationErrors();
    console.log("the errors are " + JSON.stringify(errors, null, 4));
    var peopleArray = [];
    if (req.body.people) {
      var peopleArray = req.body.people.split(",");
      for (var i = 0; i < peopleArray.length; i++) {
        peopleArray[i] = peopleArray[i].trim();
      }
    }
    var theShoot = new Shoot(
      { shootId: req.body.shootId, people: peopleArray, fcpxml: req.body.fcpxml  }
    );
    if (errors) {
        //If there are errors render the form again, passing the previously entered values and errors
        res.render('database/shoot_create', { title: 'Create Shoot', tabTitle: "Create Shoot", errors: errors});
    return;
    }

    else {
        // Data from form is valid.
        //Check if Shoot with same name already exists
        Shoot.findOne({ 'shootId': req.body.shootId })
            .exec( function(err, found_shoot) {
                 console.log('found_genre: ' + found_shoot);
                 if (err) { return next(err); }

                 if (found_shoot) {
                     //Genre exists, redirect to its detail page
                     res.redirect(found_shoot.url);
                 }
                 else {

                     theShoot.save(function (err) {
                       if (err) { return next(err); }
                       //Genre saved. Redirect to genre detail page
                       // res.redirect(shoot.url);
                       res.redirect(theShoot.url)
                     });

                 }

             });
    }

};

exports.shoot_delete_get = function(req, res, next) {
  async.parallel({
    shoot: function(callback) {
          Shoot.findById(req.params.id).exec(callback)
      }
    }, function(err, results) {
      if (err) { return next(err); }
      if (results.shoot==null) { // No results.
          res.redirect('/database/shoots');
      }
      // Successful, so render.
      res.render('database/shoot_delete', { title: 'Delete Shoot', tabTitle: 'Delete Shoot', theShoot: results.shoot } );
    });
};

exports.shoot_json_get = function(req, res, next) {
  Shoot.findById(req.params.id, (err, data)=>{
    console.log(JSON.stringify(data));
    if (err) { return next(err); }
    else if (data==null) { // No results.
        res.redirect('/database/shoots');
    }
    else {
      res.render('database/shoot_json', {title: 'Shoot JSON', tabTitle: 'Shoot JSON', theShoot: data})
    }
  })
}

exports.shoot_fcpxml_get = function(req, res, next) {
  Shoot.findById(req.params.id, (err, data)=>{
    console.log(JSON.stringify(data));
    if (err) { return next(err); }
    else if (data==null) { // No results.
        res.redirect('/database/shoots');
    }
    else {
      res.render('database/shoot_json', {title: 'Shoot fcpxml', tabTitle: 'Shoot fcpxml', theShoot: data})
    }
  })
}

exports.shoot_stills_get = function(req, res, next) {
  Shoot.findById(req.params.id, (err, data)=>{
    console.log(JSON.stringify(data));
    if (err) { return next(err); }
    else if (data==null) { // No results.
        res.redirect('/database/shoots');
    }
    else {
      // TODO: check to see if there are stills from this shoot in the stills db, then send to either 1) a page with the stills, or 2) a page asking if they want to randomly generate stills
      res.render('database/shoot_stills', {title: 'Shoot fcpxml', tabTitle: 'Shoot fcpxml', theShoot: data})
    }
  })
}

exports.shoot_delete_post = function(req, res) {
    async.parallel({
        shoot: function(callback) {
          Shoot.findById(req.body.dbId).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        else {
            Shoot.findByIdAndRemove(req.body.dbId, function deleteShoot(err) {
                if (err) { return next(err); }
                res.redirect('/database/shoots')
            })
        }
    });
};

exports.shoot_update_get = function(req, res, next) {
  console.log("in the get request");
  async.parallel({
      shoot: function(callback) {
          Shoot.findById(req.params.id)
          .exec(callback);
      }
      }, function(err, results) {
          if (err) { return next(err); }
          if (results.shoot==null) { // No results.
              var err = new Error('Shoot not found');
              err.status = 404;
              return next(err);
          }
          res.render('database/shoot_update', { title: 'Update Shoot', tabTitle: 'Update Shoot', theShoot:results.shoot });

      });
};

exports.shoot_update_post = function(req, res, next) {
  req.checkBody('shootId', 'Shoot ID must be alphanumeric text.').notEmpty();
  req.checkBody('fcpxml', 'Fcpxml required.').notEmpty();
  req.checkBody('people', 'People required.').notEmpty();
  req.sanitize('shootId').escape();
  req.sanitize('shootId').trim();
  req.sanitize('fcpxml').escape();
  req.sanitize('fcpxml').trim();
  req.sanitize('people').escape();
  req.sanitize('people').trim();
  var errors = req.validationErrors();
  console.log("the errors are " + JSON.stringify(errors, null, 4));
  var peopleArray = [];
  if (req.body.people) {
    var peopleArray = req.body.people.split(",");
    for (var i = 0; i < peopleArray.length; i++) {
      peopleArray[i] = peopleArray[i].trim();
    }
    console.log(JSON.stringify(peopleArray));
  }
  var theShoot = new Shoot(
    { shootId: req.body.shootId, fcpxml: req.body.fcpxml, people: peopleArray, _id:req.params.id }
  );
  if (errors) {
      res.render('shoot_create', { title: 'Create Shoot', tabTitle: "Create Shoot", errors: errors});
  return;
  }
  else {
         Shoot.findByIdAndUpdate(req.params.id, theShoot, {}, function (err,thenewshoot) {
           if (err) { return next(err); }
           res.redirect(thenewshoot.url);
         });

       }
};
