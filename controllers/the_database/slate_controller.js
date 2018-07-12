var Slate = require('../../models/slate');
var async = require('async');
var moment = require('moment');
const logTimecode = require('../../tools/workflow_tools/timecode_tools').logTimecode;

exports.slate_list = function(req, res, next) {
  Slate.find()
    .sort([['shootId', 'ascending']])
    .exec(function (err, list_slates) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('database/slate/slate_list', { title: 'Slate List',  tabTitle: 'Slate List', slate_list: list_slates});
    })
};

exports.slate_create_get = function(req, res, next) {
    res.render('database/slate/slate_create', { title: 'Create Slate', tabTitle: "Create Slate", errors: null});
};

exports.slate_create_post = function(req, res, next) {
  console.log(JSON.stringify(req.body, null, 4));
    req.checkBody('filepath', 'file path must be a valid path').notEmpty().isAscii();
    req.sanitize('filepath').trim();
    var errors = req.validationErrors();
    logTimecode(req.body.filepath, (data)=>{
      console.log(JSON.stringify(data, null, 4));
      console.log("in slate controller; callback tested: " + data.result.text);

      var slate = new Slate(
        {
          cameraTcUtc: data.result.allData.statData.birthtimeMs,
          cameraTime: moment(data.result.allData.ffprobeData.streams[0].tags.creation_time).valueOf(),
          frames: tcToFrames(data.result.allData.ffprobeData.streams[0].tags.timecode),
          clockTime: data.result.allData.statData.birthtimeMs,
          clockTimeString: data.result.allData.statData.birthtime,
          cameraTcString: data.result.allData.ffprobeData.streams[0].tags.timecode,
          description: "temp---delete when in production"
        });
      if (errors) {
        // TODO: handle errors in view
          res.render('database/slate/slate_create', { title: 'Create Slate',tabTitle: "Create Slate", errors: errors});
      return;
      }
      else {
      // Data from form is valid
          slate.save(function (err) {
              if (err) { return next(err); }
                //  res.redirect(slate.url);
                // res.redirect('/database/slates');
                res.send("<h2>Got your data</h2><pre>"+data.result.text+"\n\n"+data.result.prettyFileCreationDate+"</pre><br/><br/><h2>and your full JSON</h2><pre>"+JSON.stringify(data, null, 4)+"</pre>");
              });

      }







    })

};

exports.slate_create_manual_get = function(req, res, next) {
    res.render('database/slate/slate_create_manual', { title: 'Create Slate Manually', tabTitle: "Create Slate Manually", errors: null});
};

exports.slate_create_manual_post = function(req, res, next) {
  console.log("made it into slateController and in the slate_create function");
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
    var slate = new Slate(
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
        res.render('database/slate/slate_create_manual', { title: 'Create Slate Manually',tabTitle: "Create Slate Manually", errors: errors});
    return;
    }
    else {
    // Data from form is valid
        slate.save(function (err) {
            if (err) { return next(err); }
               //successful - redirect to new author record.
              //  res.redirect(slate.url);
              res.redirect('/database/slates');
            });

    }

};

exports.slate_detail = function(req, res, next) {
  console.log(req.params.id + " is the req.params.id");
  Slate.findById(req.params.id, (err, slate)=>{
    if (err) {
      return next(err);
    }
    if (slate==null) {
      var err = new Error('Slate not found');
      err.status = 404;
      return next(err);
    }
    else {
      res.render('database/slate/slate_detail', {title: 'Slate Detail', tabTitle: "Slate Detail", theSlate: slate})
    }
  })
};

exports.slate_delete_get = function(req, res) {
  async.parallel({
    slate: function(callback) {
          Slate.findById(req.params.id).exec(callback)
      }
      // ,
      // authors_books: function(callback) {
      //   Book.find({ 'author': req.params.id }).exec(callback)
      // },
    }, function(err, results) {
      if (err) { return next(err); }
      if (results.slate==null) { // No results.
          res.redirect('/database/slates');
      }
      // Successful, so render.
      res.render('database/slate/slate_delete', { title: 'Delete Slate', tabTitle: 'Delete Slate', theSlate: results.slate } );
    });
};

exports.slate_delete_post = function(req, res) {
  // res.header("Content-Type",'application/json');
  // res.send('NOT IMPLEMENTED: shoot delete POST\n' + JSON.stringify(req.body, null, 4));
  async.parallel({
      slate: function(callback) {
        Slate.findById(req.body.dbId).exec(callback)
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
          Slate.findByIdAndRemove(req.body.dbId, function deleteSlate(err) {
              if (err) { return next(err); }
              // Success - go to author list
              res.redirect('/database/slates')
          })
      }
  });
};

exports.slate_update_get = function(req, res, next) {
  console.log("in the get request");
  // Get book, authors and genres for form.
  async.parallel({
      slate: function(callback) {
          Slate.findById(req.params.id)
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
          if (results.slate==null) { // No results.
              var err = new Error('Slate not found');
              err.status = 404;
              return next(err);
          }
          var errors = null;
          res.render('database/slate/slate_update', { title: 'Update Slate', tabTitle: 'Update Slate', theSlate:results.slate, errors: errors });

      });
}

exports.slate_update_post = function(req, res, next) {
  console.log("just got slate update and req.body is \n\n" +
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
  var slate = new Slate(
    { cameraTcUtc: req.body.cameraTcUtc, cameraTime: req.body.cameraTime, clockTime: req.body.clockTime, clockTimeString: req.body.clockTimeString, cameraTcString: req.body.cameraTcString, description: req.body.description, _id:req.body.dbId }
  );
  if (errors) {
      //If there are errors render the form again, passing the previously entered values and errors
      res.render('database/slate/slate_update', { title: 'Create Slate', tabTitle: "Create Slate", theSlate: slate, errors: errors});
  return;
  }
  else {
         Slate.findByIdAndUpdate(req.body.dbId, slate, {}, function (err,thenewslate) {
           if (err) { return next(err); }
           //successful - redirect to book detail page.
           res.redirect(thenewslate.url);
         });

       }

}

function tcToFrames(tc){
  var frames = tc.split(":")[0]*60*60*24
    + tc.split(":")[1]*60*24
    + tc.split(":")[2]*24
    + tc.split(":")[3];
  return frames;
}
