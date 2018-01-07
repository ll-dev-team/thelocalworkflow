var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = Schema(
  {
    type: {type: String, required: true},
    user: {type: String, required: true},
    text: {type: String, required: true},
    ts: {type: String, required: true}
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
module.exports = mongoose.model('message', MessageSchema);
