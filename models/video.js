var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// TODO: needs to be written

var VideoSchema = new Schema({
    shootId : String,
    fileName: String,
    paths: [String],
    proxy: Boolean,
    proxyLoc: String,
    ffprobeOutput: String,
    length: String,
    inTc: String,
    outTc: String,
    inUnixTime: Number,
    outUnixTime: Number,
}, {strict: false});

VideoSchema
  .virtual('url')
  .get(function () {
    return '/database/video/' + this._id;
});

ShootSchema
  .virtual('deleteUrl')
  .get(function () {
    return ('/database/video/' + this._id + '/delete');
});

module.exports = mongoose.model('video', ShootSchema );


// TODO: finalize the data structure for shoots.  Notes below
//
// shootId: String,
// shootTitle: String,
// shootContact: String,
// people: [],
// cameras: [],
// clips: [],
// shootStartTs: Date,
// shootEndTs: Date,
// fcpxmls: [],
// pathLog: [],
// mcStartTc:
// mcEndTc:
// mcStartUtc:
// mcStopUtc:
//
// ----VIRTUALS----
// SHOULD we make these virtual?  or store them for spreadsheet export?
// .virtual('duration')
// .virtual('startLlFormatted')
// .virtual('endLlFormatted')
// .virtual('shootReport')
//
//
//
//
//
//
//
