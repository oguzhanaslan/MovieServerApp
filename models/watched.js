var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
require('./user');
require('./movie');
require('./comments');

// Book Schema
var watchedSchema = new mongoose.Schema({
	movies:[{
		type: Schema.Types.ObjectId,
		ref: 'Movie'
	}],
});

var Watched = module.exports = mongoose.model('Watched', watchedSchema);
