var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MomentSchema = Schema(
  {
    shootId: {type: String, required: true},
    inPoint: {type: String, required: true, max: 20},
    outPoint: {type: String, required: true, max: 20},
    description: {type: String}
  }
);

MomentSchema
  .virtual('url')
  .get(function () {
    return '/database/moment/' + this._id;
});

// TODO: add a virtual('duration')--using functions elsewhere in the app? or in here?

module.exports = mongoose.model('moment', MomentSchema);
