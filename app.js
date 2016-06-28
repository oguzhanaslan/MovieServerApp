var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan      = require('morgan');
var configDB = require('./config/database.js');
var helper = require('./config/helper.js');
var url = require('url'); // standard node module

// Connect to Mongoose
mongoose.connect(configDB.url); // connect to our database
mongoose.connection.on('error', () => {
  console.log('MongoDB connection error. Please make sure that MongoDB is running.');
  process.exit(1);
});

// Cross Domain Settings
// app.use(allowCrossDomain);
// app.use(domainBlock);

app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'));

// Calling Model files
// Genre =require('./models/genre');
Movie = require('./models/movie');

//  Default Url
app.get('/', function(req, res){
	res.send('Please use /api/books or /api/genres');
});

// get All Movies
app.get('/api/movies/', function(req, res){
	Movie.find({}, function(err, result) {
  	if (err) throw err;
  	res.json(result)
	});
});

// get movie in category
app.get('/api/category/:category', function(req, res){
  var category = req.params.category;
	Movie.find({category: category}, function(err, result) {
  	if (err) throw err;
  	res.json(result)
	});
});

// get single movie
app.get('/api/movies/:id', function(req, res){
	if (req.params.id) {
		Movie.findOne({_id : req.params.id}, function(err, result) {
			if (err){
				res.status(500).send('Something broke!');
			}
	  	res.json(result)
		});
	}
});

//  delete movies
app.delete('/api/movies/:id', function(req, res){
	Movie.findOneAndRemove({_id : req.params.id}, function(err, result){
		if(err){
			res.status(500).send('Something broke!');
		}
		res.json(result);
		console.log('User deleted!');
	});
});

// update movies
app.put('/api/movies/:id', function(req, res){
	var id = req.params._id;
	var movie = req.body;
	var update = {
		title: movie.title,
		pilot: movie.pilot,
		thumbnailUrl: movie.thumbnailUrl,
		category: movie.category,
		tags: movie.tags,
		photosInMovie: movie.photosInMovie,
		videoLink: movie.videoLink,
		director: movie.director,
		writers: movie.writers,
		stars: movie.stars,
		movie_date: movie.movie_date,
		language: movie.language,
		imbdPoint: movie.imbdPoint,
	}
	Movie.findOneAndUpdate(id, update, function(err, result){
		if(err){
			throw err;
		}
		res.json(result);
		console.log("Update Basariyla Gerceklestirildi")
	});
});

//  create movies
app.post('/api/movies', function(req, res){
	var movie = req.body;
	Movie.create(movie, function(err, result){
		if(err){
			throw err;
		}
		res.json(result);
	});
});

app.listen(3000);
console.log('Running on port 3000...');
