var Shoot = require('../../models/shoot');
var async = require('async');
var fs = require ('fs');
var pd = require('pretty-data').pd;
const parseXmlString = require('xml2js').parseString;

exports.shoot_list = function(req, res, next) {
    Shoot.find({})
      .exec(function (err, list_shoots) {
        if (err) { return next(err); }
        //Successful, so render
        console.log(JSON.stringify(list_shoots, null, 4));
        res.render('database/shoot_list', { title: 'Shoot List', tabTitle: "Shoot List", shoot_list: list_shoots });
      });
}

exports.shoot_detail = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: shoot detail: ' + req.params.id);
    async.parallel({
        shoot: function(callback) {
                Shoot.findById(req.params.id)
                  .exec(callback);
            }

            // ,
            // genre_books: function(callback) {
            //   Book.find({ 'genre': req.params.id })
            //   .exec(callback);
            // },

        }, function(err, results) {
            if (err) { return next(err); }
            if (results.shoot==null) { // No results.
                var err = new Error('Shoot not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render
            // var pdFcpxml = pd.xml(results.shoot.fcpxml);
            // console.log("\n\npdFcpxml: \n\n"+ pdFcpxml);
            // console.log(JSON.stringify(results.shoot, null, 4));

            res.render('database/shoot_detail', { title: 'Shoot Detail', tabTitle: 'Shoot Detail', theShoot: results.shoot, prettyFcpxml: (pd.xml(results.shoot.fcpxml))})
            // , genre_books: results.genre_books
            } );
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
      // peopleArray.map(function(s){return s.trim()});
      // console.log(JSON.stringify(peopleArray));
    }
    // var xmlData = fs.readFileSync('/Users/mk/Development/thelocalworkflow/tools/examples/20171018_002_Test_JustStudio_v1_copy.fcpxml', "utf-8");
    // console.log("the XML data is +++++++++++++++++++++++++++++++" + xmlData);
    var theShoot = new Shoot(
      { shootId: req.body.shootId, people: peopleArray, fcpxml: req.body.fcpxml  }
    );

    // console.log(JSON.stringify(theShoot, null, 4));
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
      // ,
      // authors_books: function(callback) {
      //   Book.find({ 'author': req.params.id }).exec(callback)
      // },
    }, function(err, results) {
      if (err) { return next(err); }
      if (results.shoot==null) { // No results.
          res.redirect('/database/shoots');
      }
      // Successful, so render.
      res.render('database/shoot_delete', { title: 'Delete Shoot', tabTitle: 'Delete Shoot', theShoot: results.shoot } );
    });
};

exports.shoot_delete_post = function(req, res) {
    // res.header("Content-Type",'application/json');
    // res.send('NOT IMPLEMENTED: shoot delete POST\n' + JSON.stringify(req.body, null, 4));
    async.parallel({
        shoot: function(callback) {
          Shoot.findById(req.body.dbId).exec(callback)
        },
        // authors_books: function(callback) {
        //   Book.find({ 'author': req.body.authorid }).exec(callback)
        // },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        // if (results.authors_books.length > 0) {
        //     // Author has books. Render in same way as for GET route.
        //     res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
        //     return;
        // }
        else {
            Shoot.findByIdAndRemove(req.body.dbId, function deleteShoot(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/database/shoots')
            })
        }
    });
};

exports.shoot_update_get = function(req, res, next) {
  console.log("in the get request");
  // Get book, authors and genres for form.
  async.parallel({
      shoot: function(callback) {
          Shoot.findById(req.params.id)
          // .populate('author').populate('genre')
          .exec(callback);
      }
      // ,
      // authors: function(callback) {
      //     Author.find(callback);
      // },
      // genres: function(callback) {
      //     Genre.find(callback);
      // },
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
  // res.header("Content-Type",'application/json');
  // res.send('NOT IMPLEMENTED: shoot update POST\n' + JSON.stringify(req.body, null, 4));
  req.checkBody('shootId', 'Shoot ID must be alphanumeric text.').notEmpty();
  req.checkBody('fcpxml', 'Fcpxml required.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
  req.checkBody('people', 'People required.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
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
    // peopleArray.map(function(s){return s.trim()});
    console.log(JSON.stringify(peopleArray));
  }
  var theShoot = new Shoot(
    { shootId: req.body.shootId, fcpxml: req.body.fcpxml, people: peopleArray, _id:req.params.id }
  );
  if (errors) {
      //If there are errors render the form again, passing the previously entered values and errors
      res.render('shoot_create', { title: 'Create Shoot', tabTitle: "Create Shoot", errors: errors});
  return;
  }
  else {
         Shoot.findByIdAndUpdate(req.params.id, theShoot, {}, function (err,thenewshoot) {
           if (err) { return next(err); }
           //successful - redirect to book detail page.
           res.redirect(thenewshoot.url);
         });

       }
};
