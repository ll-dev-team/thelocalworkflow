var Clip = require('../../models/clip');
var async = require('async');
var moment = require('moment');
var colors = require('colors/safe');

exports.clip_list = function(req, res, next) {
  Clip.find()
    .select('_id ll_id filename')
    .sort([['filename', 'descending']])
    .limit(10)
    .exec(function (err, list_clips) {
      if (err) { return next(err); }
      //Successful, so render
      console.log(JSON.stringify(list_clips, null, 4));
      res.render('database/clip/clip_list', { title: 'Clip List',  tabTitle: 'Clip List', clip_list: list_clips});
    })
};

exports.clip_create_get = function(req, res, next) {
    res.render('database/clip/clip_create', { title: 'Create Clip', tabTitle: "Create Clip", errors: null});
};

exports.clip_create_post = function(req, res, next) {
  console.log(JSON.stringify(req.body, null, 4));
    req.checkBody('filepath', 'file path must be a valid path').notEmpty().isAscii();
    req.sanitize('filepath').trim();
    var errors = req.validationErrors();
    logTimecode(req.body.filepath, (data)=>{
      console.log(colors.magenta("magenta data in the post route:\n" + JSON.stringify(data, null, 4)));
      console.log("in clip controller; callback tested: " + JSON.stringify(data.clip));
      var clip = new Clip(data.clip);
      if (errors) {
        // TODO: send errors to the view
          res.render('database/clip/clip_create', { title: 'Create Clip',tabTitle: "Create Clip", errors: errors});
          return;
      }
      else {
      // Data from form is valid
          clip.save(function (err) {
            if (err) { return next(err); }
              // TODO: ultimately redirect to appropriate db view
              // res.redirect(clip.url);
              // res.redirect('/database/clips');
              res.send("<h2>Got your data</h2><pre>"+JSON.stringify(data, null, 4)+"</pre>");
          });

      }







    })

};

exports.clip_create_manual_get = function(req, res, next) {
    res.render('database/clip/clip_create_manual', { title: 'Create Clip Manually', tabTitle: "Create Clip Manually", errors: null});
};

exports.clip_create_manual_post = function(req, res, next) {
  console.log("made it into clipController and in the clip_create function");
  console.log(JSON.stringify(req.body, null, 4));
    req.checkBody('cameraTcString', 'Camera timecode must be entered').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('clockTimeString', 'Clock time must be specified.').notEmpty();
    // req.sanitize('shootId').escape();
    // req.sanitize('inPoint').escape();
    // req.sanitize('outPoint').escape();
    // req.sanitize('description').escape();
    req.sanitize('clockTimeString').trim();
    req.sanitize('cameraTcString').trim();
    // req.sanitize('outPoint').trim();
    // req.sanitize('description').trim();
    var errors = req.validationErrors();
    var clip = new Clip(
      {
        cameraTcUtc: 1234567,
        cameraTime: 1234567,
        clockTime: 1234567,
        clockTimeString: req.body.clockTimeString,
        cameraTcString: req.body.cameraTcString,
        description: "temp---delete when in production"
      });
    if (errors) {
      // TODO: handle errors in view
        res.render('database/clip/clip_create_manual', { title: 'Create Clip Manually',tabTitle: "Create Clip Manually", errors: errors});
    return;
    }
    else {
    // Data from form is valid
        clip.save(function (err) {
            if (err) { return next(err); }
               //successful - redirect to new author record.
              //  res.redirect(clip.url);
              res.redirect('/database/clips');
            });

    }

};

exports.clip_detail_ll_id = function(req, res, next) {
  console.log(req.params.ll_id + " is the req.params.ll_id");
  Clip.find({ll_id: req.params.ll_id}, (err, clip)=>{
    if (err) {
      return next(err);
    }
    if (clip==null) {
      console.log("didn't find anything");
      var err = new Error('Clip not found');
      err.status = 404;
      return next(err);
    }
    else {
      console.log("found your clip: \n" + JSON.stringify(clip, null, 4));
      // res.render('database/clip/clip_detail', {title: 'Clip Detail', tabTitle: "Clip Detail", theClip: clip});
      res.send("<pre>"+JSON.stringify(clip, null, 4)+"</pre>")
    }
  })
};

exports.clip_detail_id = function(req, res, next) {
  console.log(req.params.id + " is the req.params.id");
  Clip.find({ll_id: req.params.id}, (err, clip)=>{
    if (err) {
      return next(err);
    }
    if (clip==null) {
      console.log("didn't find anything");
      var err = new Error('Clip not found');
      err.status = 404;
      return next(err);
    }
    else {
      console.log("found your clip: \n" + JSON.stringify(clip, null, 4));
      // res.render('database/clip/clip_detail', {title: 'Clip Detail', tabTitle: "Clip Detail", theClip: clip});
      res.send("<pre>"+JSON.stringify(clip, null, 4)+"</pre>")
    }
  })
};

exports.clip_delete_get = function(req, res) {
  async.parallel({
    clip: function(callback) {
          Clip.findById(req.params.id).exec(callback)
      }
      // ,
      // authors_books: function(callback) {
      //   Book.find({ 'author': req.params.id }).exec(callback)
      // },
    }, function(err, results) {
      if (err) { return next(err); }
      if (results.clip==null) { // No results.
          res.redirect('/database/clips');
      }
      // Successful, so render.
      res.render('database/clip/clip_delete', { title: 'Delete Clip', tabTitle: 'Delete Clip', theClip: results.clip } );
    });
};

exports.clip_delete_post = function(req, res) {
  // res.header("Content-Type",'application/json');
  // res.send('NOT IMPLEMENTED: shoot delete POST\n' + JSON.stringify(req.body, null, 4));
  async.parallel({
      clip: function(callback) {
        Clip.findById(req.body.dbId).exec(callback)
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
          Clip.findByIdAndRemove(req.body.dbId, function deleteClip(err) {
              if (err) { return next(err); }
              // Success - go to author list
              res.redirect('/database/clips')
          })
      }
  });
};

exports.clip_update_get = function(req, res, next) {
  console.log("in the get request");
  // Get book, authors and genres for form.
  async.parallel({
      clip: function(callback) {
          Clip.findById(req.params.id)
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
          if (results.clip==null) { // No results.
              var err = new Error('Clip not found');
              err.status = 404;
              return next(err);
          }
          var errors = null;
          res.render('database/clip/clip_update', { title: 'Update Clip', tabTitle: 'Update Clip', theClip:results.clip, errors: errors });

      });
}

exports.clip_update_post = function(req, res, next) {
  console.log("just got clip update and req.body is \n\n" +
      JSON.stringify(req.body, null, 4));
  req.checkBody('cameraTcUtc', 'cameraTcUtc must be a number.').notEmpty();
  req.checkBody('cameraTcString', 'cameraTcString required.').notEmpty();
  req.sanitize('cameraTcUtc').trim();
  req.sanitize('cameraTcUtc').escape();
  req.sanitize('clockTimeString').trim();
  req.sanitize('clockTimeString').escape();
  req.sanitize('cameraTcString').trim();
  req.sanitize('cameraTcString').escape();
  req.sanitize('clockTime').escape();
  req.sanitize('clockTime').trim();
  req.sanitize('cameraTime').escape();
  req.sanitize('cameraTime').trim();
  req.sanitize('description').escape();
  req.sanitize('description').trim();
  var errors = req.validationErrors();
  console.log("the errors are " + JSON.stringify(errors, null, 4));
  console.log("and req.body.dbId is " + req.body.dbId)
  var clip = new Clip(
    { cameraTcUtc: req.body.cameraTcUtc, cameraTime: req.body.cameraTime, clockTime: req.body.clockTime, clockTimeString: req.body.clockTimeString, cameraTcString: req.body.cameraTcString, description: req.body.description, _id:req.body.dbId }
  );
  if (errors) {
      //If there are errors render the form again, passing the previously entered values and errors
      res.render('database/clip/clip_update', { title: 'Create Clip', tabTitle: "Create Clip", theClip: clip, errors: errors});
  return;
  }
  else {
         Clip.findByIdAndUpdate(req.body.dbId, clip, {}, function (err,thenewclip) {
           if (err) { return next(err); }
           //successful - redirect to book detail page.
           res.redirect(thenewclip.url);
         });

       }

}
