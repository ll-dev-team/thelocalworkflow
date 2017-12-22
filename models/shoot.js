var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShootSchema = new Schema({
    shootId : String,
    fcpxml : String,
    fcpxmlAsJson : {},
    clips : []
}, {strict: false});


ShootSchema
  .virtual('url')
  .get(function () {
    return '/database/shoot/' + this._id;
});

module.exports = mongoose.model('shoot', ShootSchema );
