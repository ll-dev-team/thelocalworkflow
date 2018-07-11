var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SlateSchema = Schema(
  {
    cameraTcUtc: {type: Number, required: true, max: 9531221617000},
    cameraTime: {type: Number, required: true, max: 9531221617000},
    clockTime: {type: Number, required: true, max: 9531221617000},
    clockTimeString: {type: String, required: true, max: 40},
    cameraTcString: {type: String, required: true, max: 15},
    description: {type: String}
  }
);

SlateSchema
  .virtual('url')
  .get(function () {
    return '/database/slate/' + this._id;
});

SlateSchema
  .virtual('offset')
  .get(function () {
    return this.cameraTcUtc - this.clockTime;
  });
module.exports = mongoose.model('slate', SlateSchema);
