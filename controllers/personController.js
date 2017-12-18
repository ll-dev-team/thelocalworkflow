var Person = require('../models/person');

// Display list of all Authors
exports.person_list = function(req, res) {
    res.send('NOT IMPLEMENTED: person list');
};

// Display detail page for a specific Author
exports.person_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: person detail: ' + req.params.id);
};

// Display Author create form on GET
exports.person_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: person create GET');
};

// Handle Author create on POST
exports.person_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: person create POST');
};

// Display Author delete form on GET
exports.person_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: person delete GET');
};

// Handle Author delete on POST
exports.person_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: person delete POST');
};

// Display Author update form on GET
exports.person_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: person update GET');
};

// Handle Author update on POST
exports.person_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: person update POST');
};
