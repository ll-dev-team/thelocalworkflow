var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fcpxmlSchema = new Schema({
    shoot_id : String,
    fcpxml : String,
    unescapedFcpxml: String,
}, {strict: false});

module.exports = mongoose.model('fcpxml', fcpxmlSchema );
