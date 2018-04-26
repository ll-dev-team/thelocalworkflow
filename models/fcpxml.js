var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fcpxmlSchema = new Schema({
    shootId : String,
    shootIdRoot: String,
    fcpxml : String,
    fcpxmlObj : {},
    fcpxmlAsJson: String,
    ts: Number
}, {strict: false});

module.exports = mongoose.model('fcpxml', fcpxmlSchema );
