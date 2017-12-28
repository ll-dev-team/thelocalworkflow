var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StillSchema = Schema(
  {
    type: {type: String, required: true},
    user: {type: String, required: true},
    text: {type: String, required: true},
    ts: {type: String, required: true}
  }
);

ShootSchema
  .virtual('url')
  .get(function () {
    return '/database/still/' + this._id;
});

module.exports = mongoose.model('Still', StillSchema);
