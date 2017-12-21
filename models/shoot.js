var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShootSchema = new Schema({
    shootId : String,
    fcpxml : String,
    fcpxmlAsJson : {},
    clips : []
}, {strict: false});



module.exports = mongoose.model('shoot', ShootSchema );
