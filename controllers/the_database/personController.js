var Person = require('../../models/person');
var Shoot = require('../../models/shoot');
var async = require('async');
var pd = require('pretty-data').pd;

exports.person_list = function(req, res, next) {
  console.log("+++++++++++in person_list");
  Person.find({})
    .exec(function (err, list_people) {
      if (err) { return next(err); }
      //Successful, so render
      console.log(JSON.stringify(list_people, null, 4));
      res.render('database/person_list', { title: 'Person List', tabTitle: "Person List", people_list: list_people });

    });
};

exports.person_detail = function(req, res, next) {
  console.log("about to start async");
  Person.findById(req.params.id, (err, person)=>{
    if (err) {
      return next(err);
    }
    if (person==null) {
      var err = new Error('Person not found');
      err.status = 404;
      return next(err);
    }
    else {
      Shoot.find({people: person.firstName}, (err, shoots)=>{
        console.log("\n\nfound: \n\n " + JSON.stringify(person, null, 4));
        console.log("with these shoots: \n\n" + JSON.stringify(shoots, null, 4));
        res.render('database/person_detail', { title: 'Person Detail', tabTitle: 'Person Detail', thePerson: person, personShoots: shoots })
      })
    }
  })
};

exports.person_create_get = function(req, res) {
    res.render('database/person_create', {title: "Create Person", tabTitle: "Create Person"});
};

exports.person_create_post = function(req, res) {
    console.log("just got a post request:\n" + JSON.stringify(req.body, null, 4));
    req.checkBody('firstName', 'must have a first name.').notEmpty();
    req.checkBody('lastName', 'must have a last name.').notEmpty();
    req.checkBody('title', 'must have a title.').notEmpty();
    req.sanitize('firstName').escape();
    req.sanitize('lastName').escape();
    req.sanitize('title').escape();
    req.sanitize('firstName').trim();
    req.sanitize('lastName').trim();
    req.sanitize('title').trim();
    var errors = req.validationErrors();
    console.log("the errors are " + JSON.stringify(errors, null, 4));
    var thePerson = new Person({firstName: req.body.firstName, lastName: req.body.lastName, title: req.body.title});
    if (errors) {
      res.render('database/person_create', {title: 'Create Person', tabTitle: 'Create Person', errors: errors});
      return;
    }
    else {
      //  check if person already exists
      theFullName = (req.body.firstName + " " + req.body.lastName);
      Person.findOne({'fullName': theFullName})
        .exec(function(err, found_person){
          console.log('found person: ' + found_person);
          if (err) {
            return next(err);
          }
          else {
            thePerson.save(function(err) {
              if (err) {
                return next(err);
              }
              res.redirect(thePerson.url)
            })
          }
        })
    }

};

exports.person_delete_get = function(req, res, next) {
  async.parallel({
    person: function(callback) {
          Person.findById(req.params.id).exec(callback)
      }
      // ,
      // authors_books: function(callback) {
      //   Book.find({ 'author': req.params.id }).exec(callback)
      // },
    }, function(err, results) {
      console.log(JSON.stringify(results, null, 4));
      if (err) { return next(err); }
      if (results.person==null) { // No results.
          res.redirect('/database/people');
      }
      // Successful, so render.
      console.log("about to search for person_delete");
      Shoot.find({people: results.person.firstName}, (err, shoots)=>{
        res.render('database/person_delete', { title: 'Delete Person', tabTitle: 'Delete Person', thePerson: results.person, personShoots: shoots} );
      })
    });
};

exports.person_delete_post = function(req, res) {
  console.log("starting delete function");
  console.log(JSON.stringify(req.body, null, 4));
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
            Person.findByIdAndRemove(req.body.dbId, function deletePerson(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/database/people')
            })
        }
    });
};

exports.person_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: person update GET');
};

exports.person_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: person update POST');
};
