var mongoose = require('mongoose');
var Movie    = require('../models/movie');
var User     = require('../models/user');
var Comment  = require('../models/comments');
var passport = require('passport');
var configDB = require('../config/database.js');

module.exports.controller = function(app) {
  app.get('/api/movies/', function(req, res) {
      Movie.find({}).populate('comments').exec(function(err, result) {
          if (err) {
            res.status(500).send('Something broke!');
          }
          res.json(result)
      });
  });

    // get movie in category
    app.get('/api/category/:category', function(req, res) {
      var category = req.params.category;
      Movie.find({
          category: category
      }, function(err, result) {
          if (err)
              res.status(500).send('Something broke!');
          res.json(result);
      }).populate('comments');
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
          }).populate('comments');
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
          imbdPoint: movie.imbdPoint
      }
      Movie.findOneAndUpdate(id, update, function(err, result) {
          if (err) {
            res.status(404).send('Something broke!');
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
            res.status(500).send('Something broke!');
          }
          res.json("Success");
      });
    });
}
