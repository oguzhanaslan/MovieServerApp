var mongoose = require('mongoose');
var Movie = require('../models/movie');
var User = require('../models/user');
var Comment = require('../models/comments');
var passport = require('passport');
var configDB   = require('../config/database.js');

module.exports.controller = function(app) {
  app.get('/api/movies/', function(req, res) {
      Movie.find({})
          .populate('comments')
          .exec(function(err, result) {
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
  app.post('/api/movies/:id', passport.authenticate('jwt', {
      session: false
  }), function(req, res) {
      Movie.findOne({
          _id: req.params.id
      }, function(err, movie) {
          var comment = new Comment(req.body);
          var token = getToken(req.headers);
          if (token) {
              var decoded = jwt.decode(token, configDB.secret);
              comment._user = decoded._id;
              comment.user_name = decoded.name;
              comment.user_thumbnail = decoded.thumbnail;
              comment.user_age = decoded.age;
              comment._movie = movie._id;
              movie.comments.push(comment);
              comment.save(function(err) {
                  console.log(err)
                  movie.save(function(err) {
                      if (err) {
                          console.log(err);
                      } else {
                          res.json("gonderildi");
                      }
                  })
              })
          } else {
              console.log(err);
          }
      })
  });
}
