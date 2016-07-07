var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var Schema   = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);


require('./comments');
require('./user');
require('./watched');

// set up a mongoose model
var UserSchema = new mongoose.Schema({
  name: {
      type    : String,
      unique  : true,
      required: true
  },
  email: {
      type    : String,
      unique  : true,
      required: true
  },
  password: {
      type    : String,
      required: true
  },
  thumbnail: {
    type: String,
  },
  age : {
    type: Number
  },
  comments:[{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}],
});

UserSchema.pre('save', function(next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
      bcrypt.genSalt(10, function(err, salt) {
          if (err) {
              return next(err);
          }
          bcrypt.hash(user.password, salt, function(err, hash) {
              if (err) {
                  return next(err);
              }
              user.password = hash;
              next();
          });
      });
  } else {
      return next();
  }
});

UserSchema.methods.comparePassword = function(passw, cb) {
  bcrypt.compare(passw, this.password, function(err, isMatch) {
      if (err) {
          return cb(err);
      }
      cb(null, isMatch);
  });
};

var User = module.exports = mongoose.model('User', UserSchema);
