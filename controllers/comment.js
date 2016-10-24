var mongoose = require('mongoose');
var Movie    = require('../models/movie');
var User     = require('../models/user');
var Comment  = require('../models/comments');
var passport = require('passport');
var jwt      = require('jwt-simple');
var configDB = require('../config/database.js');

module.exports.controller = function(app) {
  // Add a comment
  app.post('/api/movies/:id', passport.authenticate('jwt', {session: false}), function(req, res) {
      Movie.findOne({
          _id: req.params.id
      }, function(err, result) {
          var comment = new Comment(req.body);
          var token = getToken(req.headers);
          if (token) {
              var decoded = jwt.decode(token, configDB.secret);
              result.comments.push(comment);
              comment._movie = result._id;
              comment._user = decoded._id;
              comment.user_name = decoded.name;
              comment.user_thumbnail = decoded.thumbnail;
              comment.save(function(err) {
                console.log(err)
                result.save(function(err,result) {
                    if (err) {
                      res.status(500).send('Something broke!');
                      console.log(err);
                    } else {
                      res.json(result);
                    }
                });
              })
          } else {
            res.status(401).send('Unauthorized!');
            console.log(err);
          }
      })
  });
}
