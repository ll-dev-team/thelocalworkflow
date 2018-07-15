var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// TODO: needs to be written

var TestSchema = new Schema({
    name : String,
}, {strict: false});

module.exports = mongoose.model('test', TestSchema );
