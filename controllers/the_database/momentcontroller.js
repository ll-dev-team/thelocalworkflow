var Moment = require('../../models/moment')
var async = require('async')

exports.moment_list = function(req, res, next) {
  Moment.find()
    .sort([['shootId', 'ascending']])
    .exec(function (err, list_moments) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('database/moment_list', { title: 'Moment List',  tabTitle: 'Moment List', moment_list: list_moments});
    })
};

exports.moment_create_get = function(req, res, next) {
    res.render('database/moment_create', { title: 'Create Moment', tabTitle: "Create Moment", errors: null});
};

exports.moment_create_post = function(req, res, next) {
  console.log("made it into momentController and in the moment_create function");
    req.checkBody('shootId', 'Shoot ID must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('inPoint', 'In Point must be specified.').notEmpty();
    req.checkBody('outPoint', 'Out Point must be specified.').notEmpty();
    req.sanitize('shootId').escape();
    req.sanitize('inPoint').escape();
    req.sanitize('outPoint').escape();
    req.sanitize('description').escape();
    req.sanitize('shootId').trim();
    req.sanitize('inPoint').trim();
    req.sanitize('outPoint').trim();
    req.sanitize('description').trim();
    var errors = req.validationErrors();
    var moment = new Moment(
      {
        shootId: req.body.shootId,
        inPoint: req.body.inPoint,
        outPoint: req.body.outPoint,
        description: req.body.description
      });
    if (errors) {
      // TODO: handle errors in view
        res.render('database/moment_create', { title: 'Create Moment',tabTitle: "Create Moment", errorList: errors});
    return;
    }
    else {
    // Data from form is valid
        moment.save(function (err) {
            if (err) { return next(err); }
               //successful - redirect to new author record.
              //  res.redirect(moment.url);
              res.redirect('/database/moments');
            });

    }

};

exports.moment_detail = function(req, res, next) {
  Moment.findById(req.params.id, (err, moment)=>{
    if (err) {
      return next(err);
    }
    if (moment==null) {
      var err = new Error('Moment not found');
      err.status = 404;
      return next(err);
    }
    else {
      res.render('database/moment_detail', {title: 'Moment Detail', tabTitle: "Moment Detail", theMoment: moment})
    }
  })
};

exports.moment_delete_get = function(req, res) {
  async.parallel({
    moment: function(callback) {
          Moment.findById(req.params.id).exec(callback)
      }
      // ,
      // authors_books: function(callback) {
      //   Book.find({ 'author': req.params.id }).exec(callback)
      // },
    }, function(err, results) {
      if (err) { return next(err); }
      if (results.moment==null) { // No results.
          res.redirect('/database/moments');
      }
      // Successful, so render.
      res.render('database/moment_delete', { title: 'Delete Moment', tabTitle: 'Delete Moment', theMoment: results.moment } );
    });
};

exports.moment_delete_post = function(req, res) {
  // res.header("Content-Type",'application/json');
  // res.send('NOT IMPLEMENTED: shoot delete POST\n' + JSON.stringify(req.body, null, 4));
  async.parallel({
      moment: function(callback) {
        Moment.findById(req.body.dbId).exec(callback)
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
          Moment.findByIdAndRemove(req.body.dbId, function deleteMoment(err) {
              if (err) { return next(err); }
              // Success - go to author list
              res.redirect('/database/moments')
          })
      }
  });
};

exports.moment_update_get = function(req, res, next) {
  console.log("in the get request");
  // Get book, authors and genres for form.
  async.parallel({
      moment: function(callback) {
          Moment.findById(req.params.id)
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
          if (results.moment==null) { // No results.
              var err = new Error('Moment not found');
              err.status = 404;
              return next(err);
          }
          var errors = null;
          res.render('database/moment_update', { title: 'Update Moment', tabTitle: 'Update Moment', theMoment:results.moment, errors: errors });

      });
}

exports.moment_update_post = function(req, res, next) {
  console.log("just got moment update and req.body is \n\n" +
      JSON.stringify(req.body, null, 4));
  req.checkBody('shootId', 'Shoot ID must be alphanumeric text.').notEmpty();
  req.checkBody('inPoint', 'In point required.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
  req.checkBody('outPoint', 'Out point required.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
  req.sanitize('shootId').escape();
  req.sanitize('shootId').trim();
  req.sanitize('inPoint').escape();
  req.sanitize('inPoint').trim();
  req.sanitize('outPoint').escape();
  req.sanitize('outPoint').trim();
  req.sanitize('description').escape();
  req.sanitize('description').trim();
  var errors = req.validationErrors();
  console.log("the errors are " + JSON.stringify(errors, null, 4));
  console.log("req.params.id is " + req.params.id);
  console.log("and req.body.dbId is " + req.body.dbId)
  var moment = new Moment(
    { shootId: req.body.shootId, inPoint: req.body.inPoint, outPoint: req.body.outPoint, description: req.body.description, _id:req.body.dbId }
  );
  if (errors) {
      //If there are errors render the form again, passing the previously entered values and errors
      res.render('moment_update', { title: 'Create Moment', tabTitle: "Create Moment", theMoment: moment, errors: errors});
  return;
  }
  else {
         Moment.findByIdAndUpdate(req.body.dbId, moment, {}, function (err,thenewmoment) {
           if (err) { return next(err); }
           //successful - redirect to book detail page.
           res.redirect(thenewmoment.url);
         });

       }

}
