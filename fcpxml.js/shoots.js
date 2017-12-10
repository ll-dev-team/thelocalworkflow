//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var shootsSchema = new Schema({
    shootId: String,
    shootDate: Date,
    clipArray: []
});

module.exports.shootsSchema = shootsSchema;
