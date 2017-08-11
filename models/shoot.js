// File: ./models/somemodel.js

//Require Mongoose
var mongoose = require('mongoose');
var person = require('../models/person');
//Define a schema
var Schema = mongoose.Schema;

var shootSchema = new Schema({
    date          : Date,
    shoot_id  : Schema.Types.ObjectId,
    in_tc : String,
    out_tc : String,
    people : [],
    notes : String
});


// Virtual for book's URL
shootSchema
.virtual('url')
.get(function () {
  return '/catalog/shoot/' + this._id;
});


//Export function to create "SomeModel" model class
module.exports = mongoose.model('shoot', shootSchema );
