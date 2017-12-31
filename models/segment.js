var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ioRequestSchema = new Schema({
    fcpxml: String,
    submissionTs: Number,
    title: String,
    ioArray: [],
}, {strict: false}
);

ioRequestSchema
  .virtual('url')
  .get(function () {
    return '/database/segment/' + this._id;
});

module.exports = mongoose.model('ioRequest', ioRequestSchema);
