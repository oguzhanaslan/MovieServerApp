var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

require('./movie');
require('./user');

// Book Schema
var commentSchema = new mongoose.Schema({
    name: String,
    text: String,
    _movie: {
      type: Schema.Types.ObjectId,
      ref: 'Movie'
    },
    _user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    user_name: String,
    user_age: String,
    user_thumbnail: String,
    updated_at: {
      type: Date,
      default: new Date
    }
});

var Comment = module.exports = mongoose.model('Comment', commentSchema);
