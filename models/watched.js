var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

require('./movie');
require('./user');

// Book Schema
var watchedSchema = new mongoose.Schema({
    _movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    },
    _user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },

});

var Watched = module.exports = mongoose.model('Watched', watchedSchema);
