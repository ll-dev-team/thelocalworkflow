var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MomentSchema = Schema(
  {
    shootId: {type: String, required: true},
    inPoint: {type: String, required: true, max: 20},
    outPoint: {type: String, required: true, max: 20},
  }
);

module.exports = mongoose.model('Moment', MomentSchema);
