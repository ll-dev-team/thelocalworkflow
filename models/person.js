//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var personSchema = new Schema({
    userId: String,
    firstName: String,
    lastName: String
});

module.exports.personSchema = personSchema;
