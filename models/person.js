var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonSchema = new Schema({
    userId: String,
    firstName: String,
    lastName: String
}, {strict: false});

module.exports = mongoose.model('Person', PersonSchema);
