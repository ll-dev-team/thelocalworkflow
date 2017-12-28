var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonSchema = new Schema({
    firstName: String,
    lastName: String,
    title: String,
    email: String
}, {strict: false});

PersonSchema
  .virtual('url')
  .get(function () {
    return '/database/person/' + this._id;
});

PersonSchema
  .virtual('fullName')
  .get(function () {
    return (this.firstName + " " + this.lastName);
});

module.exports = mongoose.model('person', PersonSchema);
