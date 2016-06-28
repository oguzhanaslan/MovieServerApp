var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan      = require('morgan');
var url = require('url'); // standard node module
var configDB = require('./config/database.js');
var helper = require('./config/helper.js');

mongoose.connect(configDB.url); // connect to our database
var db = mongoose.connection;
// Cross Domain Settings
// app.use(allowCrossDomain);
// app.use(domainBlock);
 
app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'));

// Calling Model files
// Genre =require('./models/genre');
Movie =require('./models/movie');

// Connect to Mongoose

//  Default Url
app.get('/', function(req, res){
	res.send('Please use /api/books or /api/genres');
});

// get All Movies
app.get('/api/getAllMovies/', function(req, res){
	Movie.find({}, function(err, result) {
  	if (err) throw err;
  	res.json(result)
	});
});

// get movie in category
app.get('/api/movies/:_genre', function(req, res){
  var genre = req.params._genre;
	Movie.find({category: genre}, function(err, result) {
  	if (err) throw err;
  	res.json(result)
	});
});

// app.delete('/api/genres/:_id', function(req, res){
// 	var id = req.params._id;
// 	Genre.removeGenre(id, function(err, genre){
// 		if(err){
// 			throw err;
// 		}
// 		res.json(genre);
// 	});
// });


// app.get('/api/genres', function(req, res){
// 	Genre.getGenres(function(err, genres){
// 		if(err){
// 			throw err;
// 		}
// 		res.json(genres);
// 	});
// });
//
// app.post('/api/genres', function(req, res){
// 	var genre = req.body;
// 	Genre.addGenre(genre, function(err, genre){
// 		if(err){
// 			throw err;
// 		}
// 		res.json(genre);
// 	});
// });
//
// app.put('/api/genres/:_id', function(req, res){
// 	var id = req.params._id;
// 	var genre = req.body;
// 	Genre.updateGenre(id, genre, {}, function(err, genre){
// 		if(err){
// 			throw err;
// 		}
// 		res.json(genre);
// 	});
// });
//
// app.delete('/api/genres/:_id', function(req, res){
// 	var id = req.params._id;
// 	Genre.removeGenre(id, function(err, genre){
// 		if(err){
// 			throw err;
// 		}
// 		res.json(genre);
// 	});
// });
//
// app.get('/api/books', function(req, res){
// 	Book.getBooks(function(err, books){
// 		if(err){
// 			throw err;
// 		}
// 		res.json(books);
// 	});
// });
//
// //  post
// app.post('/api/books', function(req, res){
// 	var book = req.body;
// 	Book.addBook(book, function(err, book){
// 		if(err){
// 			throw err;
// 		}
// 		res.json(book);
// 	});
// });
//
// app.put('/api/books/:_id', function(req, res){
// 	var id = req.params._id;
// 	var book = req.body;
// 	Book.updateBook(id, book, {}, function(err, book){
// 		if(err){
// 			throw err;
// 		}
// 		res.json(book);
// 	});
// });
//
// app.delete('/api/books/:_id', function(req, res){
// 	var id = req.params._id;
// 	Book.removeBook(id, function(err, book){
// 		if(err){
// 			throw err;
// 		}
// 		res.json(book);
// 	});
// });

app.listen(3000);
console.log('Running on port 3000...');
