var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShootSchema = new Schema({
    shootId : String,
    shootIdRoot : String,
    fcpxmlAsObject : {},
    clips : [],
    people: [],
    fcpxml : String,
}, {strict: false});

ShootSchema
  .virtual('url')
  .get(function () {
    return '/database/shoot/' + this._id;
});

ShootSchema
  .virtual('deleteUrl')
  .get(function () {
    return ('/database/shoot/' + this._id + '/delete');
});

module.exports = mongoose.model('shoot', ShootSchema );
