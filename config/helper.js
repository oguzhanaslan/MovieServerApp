var url = require('url');

module.exports = {
  // var domainBlock = function(req, res, next) {
  //   var ref = req.headers.referer;
  //   if(ref) {
  //     // We got a referer
  //     var u = url.parse(ref);
  //     console.log(u)
  //     if(u && u.hostname === 'google.com') {
  //       // Correct host, process the request
  //       return next();
  //     }
  //   }
  //   // Send some kind of error
  //   res.status(403).send("Invalid host");
  // };
  //
  // //  Cross Domomain Header
  // var allowCrossDomain = function(req, res, next) {
  //     res.header('Access-Control-Allow-Origin', '*');
  //     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  //     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  //     // CORS res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //
  //     if ('OPTIONS' == req.method) {
  //       res.send(200);
  //     }
  //     else {
  //       next();
  //     }
  // };
};
