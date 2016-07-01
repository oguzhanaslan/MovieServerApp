var mongoose = require('mongoose');
var Movie = require('../models/movie');
var User = require('../models/user');
var Comment = require('../models/comments');
var passport = require('passport');
var jwt = require('jwt-simple');
require('../config/passport')(passport);

module.exports.controller = function(app) {
  //  create a new user account
  app.post('/api/signup', function(req, res) {
      if (!req.body.name || !req.body.password) {
          res.json({
              success: false,
              msg: 'Kullanıcı adını veya şifresini yanlış girdiniz.'
          });
      } else {
          var newUser = new User({
              name: req.body.name,
              password: req.body.password
          });
          // save the user
          newUser.save(function(err) {
              if (err) {
                  return res.json({
                      success: false,
                      msg: 'Bu kullanıcı adı kullanılıyor.'
                  });
              }
              res.json({
                  success: true,
                  msg: 'Üyeliğiniz oluşturuldu.'
              });
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
              res.send({
                  success: false,
                  msg: 'Authentication failed. User not found.'
              });
          } else {
              // check if password matches
              user.comparePassword(req.body.password, function(err, isMatch) {
                  if (isMatch && !err) {
                      // if user is found and password is right create a token
                      var token = jwt.encode(user, configDB.secret);
                      // return the information including token as JSON
                      res.json({
                          success: true,
                          token: 'JWT ' + token
                      });
                  } else {
                      res.send({
                          success: false,
                          msg: 'Authentication failed. Wrong password.'
                      });
                  }
              });
          }
      });
  });


  // route to authenticate a user (POST http://localhost:8080/api/authenticate)
  // route to a restricted info (GET http://localhost:8080/api/memberinfo)
  app.get('/api/memberinfo', passport.authenticate('jwt', {
      session: false
  }), function(req, res) {
      var token = getToken(req.headers);
      if (token) {

          var decoded = jwt.decode(token, configDB.secret);
          User.findOne({
              name: decoded.name
          }, function(err, user) {
              if (err) throw err;

              if (!user) {
                  return res.status(403).send({
                      success: false,
                      msg: 'Authentication failed. User not found.'
                  });
              } else {
                  res.json({
                      success: true,
                      username: user.name,
                      id: user._id,
                      msg: 'Welcome in the member area ' + user.name + '!',
                  });
              }
          });
      } else {
          return res.status(403).send({
              success: false,
              msg: 'No token provided.'
          });
      }
  });

  getToken = function(headers) {
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
}
