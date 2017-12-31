var Segment = require('../../models/segment');
var async = require('async');

exports.segment_list = function(req, res) {
  Segment.find({})
    .exec(function (err, list_segment) {
      if (err) { return next(err); }
      //Successful, so render
      console.log(JSON.stringify(list_segment, null, 4));
      res.render('database/segment_list', { title: 'Segment List', tabTitle: "Segment List", segment_list: list_segment });

    });
};

exports.segment_detail = function(req, res, next) {
  Segment.findById(req.params.id, (err, segment)=>{
    if (err) {
      return next(err);
    }
    if (segment==null) {
      var err = new Error('Segment not found');
      err.status = 404;
      return next(err);
    }
    else {
      res.render('database/segment_detail', {title: 'Segment Detail', tabTitle: "Segment Detail", theSegment: segment})
    }
  })
};

exports.segment_create_get = function(req, res) {
    res.render('database/segment_create', {title: "Create Segment", tabTitle: "Create Segment", errors: null});
};

exports.segment_create_manual_get = function(req, res) {
    res.render('database/segment_create_manual', {title: "Create Segment Manually", tabTitle: "Create Segment Manually", errors: null});
};

exports.segment_create_csv_get = function(req, res) {
    res.render('database/segment_create_csv', {title: "Create Segment with csv", tabTitle: "Create Segment with csv", errors: null});
};

exports.segment_create_post = function(req, res, next) {
  if (req.body.option=="csv") {
    res.setHeader('Content-Type', 'application/json');
res.send("not done yet, but here's your json: " + JSON.stringify(req.body, null, 4));
  }
  else if (req.body.option=="manual") {
    console.log("made it into segmentController and in the segment_create function");
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
      req.sanitize('angle').trim();
      var errors = req.validationErrors();
      var segment = new Segment(
        {
          fcpxml: "none here yet",
          submissionTs: Date.now(),
          ioArray: [{shootId: req.body.shootId,
          inPoint: req.body.inPoint,
          outPoint: req.body.outPoint,
          angle: req.body.angle}]
        });
      if (errors) {
        // TODO: handle errors in view
          res.render('database/segment_create', { title: 'Create Segment',tabTitle: "Create Segment", errorList: errors});
      return;
      }
      else {
      // Data from form is valid
          segment.save(function (err) {
              if (err) { return next(err); }
                 //successful - redirect to new author record.
                //  res.redirect(moment.url);
                res.redirect('/database/segments');
              });

      }
  }
  else {
    res.send("there has been an error")
  }

};

exports.segment_delete_get = function(req, res) {
  async.parallel({
    segment: function(callback) {
          Segment.findById(req.params.id).exec(callback)
      }
      // ,
      // authors_books: function(callback) {
      //   Book.find({ 'author': req.params.id }).exec(callback)
      // },
    }, function(err, results) {
      if (err) { return next(err); }
      if (results.segment==null) { // No results.
          res.redirect('/database/segments');
      }
      // Successful, so render.
      res.render('database/segment_delete', { title: 'Delete Segment', tabTitle: 'Delete Segment', theSegment: results.segment } );
    });
};

exports.segment_delete_post = function(req, res, next) {
  // res.header("Content-Type",'application/json');
  // res.send('NOT IMPLEMENTED: shoot delete POST\n' + JSON.stringify(req.body, null, 4));
  async.parallel({
      moment: function(callback) {
        Segment.findById(req.body.dbId).exec(callback)
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
          Segment.findByIdAndRemove(req.body.dbId, function deleteSegment(err) {
              if (err) { return next(err); }
              // Success - go to author list
              res.redirect('/database/segments')
          })
      }
  });
};

exports.segment_update_get = function(req, res, next) {
  console.log("in the get request");
  // Get book, authors and genres for form.
  async.parallel({
      segment: function(callback) {
          Segment.findById(req.params.id)
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
          if (results.segment==null) { // No results.
              var err = new Error('Segment not found');
              err.status = 404;
              return next(err);
          }
          var errors = null;
          res.render('database/segment_update', { title: 'Update Segment', tabTitle: 'Update Segment', theSegment:results.segment, errors: errors });

      });
};

exports.segment_update_post = function(req, res, next) {

  console.log("just got segment update and req.body is \n\n" +
      JSON.stringify(req.body, null, 4));
  // req.checkBody('shootId', 'Shoot ID must be alphanumeric text.').notEmpty();
  // req.checkBody('inPoint', 'In point required.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
  // req.checkBody('outPoint', 'Out point required.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
  req.sanitize('fcpxml').trim();
  var errors = req.validationErrors();
  console.log("the errors are " + JSON.stringify(errors, null, 4));
  console.log("req.params.id is " + req.params.id);
  console.log("and req.body.dbId is " + req.body.dbId)
  var segment = new Segment(
    { fcpxml: req.body.fcpxml, inPoint: req.body.inPoint, outPoint: req.body.outPoint, description: req.body.description, _id:req.body.dbId }
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


};
