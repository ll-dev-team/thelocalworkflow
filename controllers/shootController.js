var Shoot = require('../models/shoot');

// Display list of all Authors
exports.shoot_list = function(req, res, next) {
    Shoot.find({})
      .exec(function (err, list_shoots) {
        if (err) { return next(err); }
        //Successful, so render
        console.log(JSON.stringify(list_shoots, null, 4));
        res.render('shootlist', { title: 'Shoot List', tabTitle: "Shoot List", shoot_list: list_shoots });
      });
}

// Display detail page for a specific Author
exports.shoot_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: shoot detail: ' + req.params.id);
};

// Display Author create form on GET
exports.shoot_create_get = function(req, res) {
    res.render('shoot_create', { title: 'Create Shoot', tabTitle: "Create Shoot", errors: null});
};

// Handle Author create on POST
exports.shoot_create_post = function(req, res, next) {
    console.log("just got a post request:\n" + JSON.stringify(req.body, null, 4));
    // req.checkBody('shootId', 'Shoot ID required').notEmpty();
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


    req.sanitize('first_name').escape();
    req.sanitize('family_name').escape();
    req.sanitize('first_name').trim();
    req.sanitize('family_name').trim();

    // check for errors here because below code will modify the value of dates which may cause validation error.
    var errors = req.validationErrors();
    req.sanitize('date_of_birth').toDate();
    req.sanitize('date_of_death').toDate();




    console.log("the errors are " + JSON.stringify(errors, null, 4));
    var peopleArray = [];
    if (req.body.people) {
      var peopleArray = req.body.people.split(",");
      peopleArray.map(function(s){return s.trim});
    }
    var theShoot = new Shoot(
      { shootId: req.body.shootId, fcpxml: req.body.fcpxml, people: peopleArray }
    );
    if (errors) {
        //If there are errors render the form again, passing the previously entered values and errors
        res.render('shoot_create', { title: 'Create Shoot', tabTitle: "Create Shoot", errors: errors});
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
                       res.redirect('/database')
                     });

                 }

             });
    }

};





// Display Author delete form on GET
exports.shoot_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: shoot delete GET');
};

// Handle Author delete on POST
exports.shoot_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: shoot delete POST');
};

// Display Author update form on GET
exports.shoot_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: shoot update GET');
};

// Handle Author update on POST
exports.shoot_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: shoot update POST');
};
