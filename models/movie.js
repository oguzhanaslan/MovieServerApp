var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
require('./comments');

// Book Schema
var movieSchema = new mongoose.Schema({
	title:{
    type: String,
    required: true
  },
  pilot:{
    type: String,
  },
	thumbnailUrl:{
		type: String,
		required: true
	},
  category:{
    type: Array,
    required: true
  },
  tags:{
    type: Array,
  },
  photosInMovie:{
    type: Array,
  },
  videoLink:{
    type: String,
    required: true
  },
  director:{
    type: Array,
  },
  writers:{
    type: Array,
  },
  stars:{
    type: Array,
  },
  movie_date:{
    type: Number,
    required: true
  },
  create_date:{
    type: Date,
    default: Date.now
  },
  language:{
    type: String,
  },
  imbdPoint:{
    type: String
  },
	viewCount :{
		type: Number
	},
	comments:[{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}],
});

var Movie = module.exports = mongoose.model('Movie', movieSchema);
