var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ioRequestSchema = new Schema({
    fcpxml: String,
    submissionTs: Number,
}, {strict: false}
);

module.exports = mongoose.model('ioRequest', ioRequestSchema );
