var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var configDB = require('./config/database.js');
var jwt = require('jwt-simple');
var fs = require('fs');
require('./config/passport')(passport);

// Cross Domain Settings
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // CORS res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if ('OPTIONS' == req.method) { res.send(200); } else { next(); }
};

// Calling Model files
var Movie = require('./models/movie');
var User = require('./models/user');
var Comment = require('./models/comments');

app.use(passport.initialize());
app.use(allowCrossDomain);
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(morgan('dev'));



// Connect to Mongoose
mongoose.connect(configDB.url); // connect to our database
mongoose.connection.on('error', () => {
  console.log('MongoDB connection error. Please make sure that MongoDB is running.');
  process.exit(1);
});

fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(app);
  }
});

//  Default Url
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + 3000);
});

app.all('*', function(req,res){
  res.status(404).json({
    success :false,
    data : 'Not Found'
  })
});

app.listen(3000);
console.log('Running on port 3000...');
