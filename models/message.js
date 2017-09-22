var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = Schema(
  {
    text: {type: String, required: true},
    channel: {type: String, required: true, max: 20},
    timeOfMessage: {type: String},
    timestamp: {type: }
  }
);

// Virtual for author's full name
// AuthorSchema
// .virtual('name')
// .get(function () {
//   return this.family_name + ', ' + this.first_name;
// });

// Virtual for author's URL
// AuthorSchema
// .virtual('url')
// .get(function () {
//   return '/catalog/author/' + this._id;
// });

//Export model
module.exports.message = mongoose.model('Message', MessageSchema);
