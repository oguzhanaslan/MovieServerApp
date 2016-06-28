var mongoose = require('mongoose');

// Book Schema
var movieSchema = mongoose.Schema({
	title:{
    type: String,
    required: true
  },
  pilot:{
    type: String,
  },
	thumbnail:{
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
  photos:{
    type: String,
    required: true
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
    type: Date,
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
  }
});

var Book = module.exports = mongoose.model('Book', movieSchema);
//
// // Get Books
// module.exports.getBooks = function(callback, limit){
// 	Book.find(callback).limit(limit);
// }
//
// module.exports.getBooksGenre = function(genre, callback){
// 	Book.findById(genre, callback);
// }
//
// // Get Book
// module.exports.getBookById = function(id, callback){
// 	Book.findById(id, callback);
// }
//
// // Add Book
// module.exports.addBook = function(book, callback){
// 	Book.create(book, callback);
// }
//
// // Update Book
// module.exports.updateBook = function(id, book, options, callback){
// 	var query = {_id: id};
// 	var update = {
// 		title: book.title,
// 		genre: book.genre,
// 		description: book.description,
// 		author: book.author,
// 		publisher: book.publisher,
// 		pages: book.pages,
// 		image_url: book.image_url,
// 		buy_url: book.buy_url
// 	}
// 	Book.findOneAndUpdate(query, update, options, callback);
// }
//
// // Delete Book
// module.exports.removeBook = function(id, callback){
// 	var query = {_id: id};
// 	Book.remove(query, callback);
// }
