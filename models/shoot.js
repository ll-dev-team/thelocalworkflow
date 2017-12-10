var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShootSchema = new Schema({
    shoot_id : String,
    clips : []
}, {strict: false});

module.exports = mongoose.model('shoot', ShootSchema );
