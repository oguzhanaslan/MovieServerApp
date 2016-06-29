var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
require('./movie');

// Book Schema
var movieSchema = new mongoose.Schema({
    name: String,
    text: String,
    _movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    },
    updated_at: {
        type: Date,
        default: new Date
    }
});

var Comment = module.exports = mongoose.model('Comment', movieSchema);
