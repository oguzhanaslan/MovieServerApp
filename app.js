var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var passport	= require('passport');
var configDB   = require('./config/database.js');
var helper     = require('./config/helper.js');
var jwt         = require('jwt-simple');
var url        = require('url');
// Calling Model files
var Movie = require('./models/movie');
var User = require('./models/user');
var Comment = require('./models/comments');

require('./config/passport')(passport);

// Connect to Mongoose
mongoose.connect(configDB.url); // connect to our database
mongoose.connection.on('error', () => {
    console.log('MongoDB connection error. Please make sure that MongoDB is running.');
    process.exit(1);
});

// Cross Domain Settings
// app.use(allowCrossDomain);
// app.use(domainBlock);

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

//  Default Url
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + 3000);
});

// get All Movies
app.get('/api/movies/', function(req, res) {
    Movie.find({}, function(err, result) {
        if (err) throw err;
        res.json(result)
    });
});

// get movie in category
app.get('/api/category/:category', function(req, res) {
    var category = req.params.category;
    Movie.find({
        category: category
    }, function(err, result) {
        if (err) throw err;
        res.json(result)
    });
});

// get single movie
app.get('/api/movies/:id', function(req, res) {
    if (req.params.id) {
        Movie.findOne({
            _id: req.params.id
        }, function(err, result) {
            if (err) {
                res.status(500).send('Something broke!');
            }
            res.json(result)
        });
    }
});

//  delete movies
app.delete('/api/movies/:id', function(req, res) {
    Movie.findOneAndRemove({
        _id: req.params.id
    }, function(err, result) {
        if (err) {
            res.status(500).send('Something broke!');
        }
        res.json(result);
        console.log('User deleted!');
    });
});

// update movies
app.put('/api/movies/:id', function(req, res) {
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
    Movie.findOneAndUpdate(id, update, function(err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
        console.log("Update Basariyla Gerceklestirildi")
    });
});

//  create movies
app.post('/api/movies', function(req, res) {
    var movie = req.body;
    Movie.create(movie, function(err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});


//add comment
app.post('/api/movies/:id',function(req,res){
	Movie.findOne({_id:req.params.id},function(err,movie){
		var comment = new Comment(req.body);
		comment._movie = movie._id;
		movie.comments.push(comment);
		comment.save(function(err){
      console.log(err)
			movie.save(function(err){
				if(err){
					console.log(err);
				}else{
					res.json("basarili gonderildi");
				}
			})
		})
	})
})

//  create a new user account
app.post('/api/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
app.post('/api/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, configDB.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
// ...

// route to a restricted info (GET http://localhost:8080/api/memberinfo)
app.get('/api/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, configDB.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, username: user.name, msg: 'Welcome in the member area ' + user.name + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};


app.listen(3000);
console.log('Running on port 3000...');
