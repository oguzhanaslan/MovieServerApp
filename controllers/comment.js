var mongoose = require('mongoose');
var Movie = require('../models/movie');
var User = require('../models/user');
var Comment = require('../models/comments');
var passport = require('passport');

module.exports.controller = function(app) {
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
