var request = require('request');
var localhost  = "http://localhost:3000/"
var remotehost = ""; 
var host = localhost;

function callback(error, response, body) {
  if (!error  && response.statusCode == 200) {
    console.log(body);
  } else {
    console.log(error);
  }
}

/** Get a user's events */
var userid = 3;
request.get(host+"get/user/events/"+userid, callback);

/** Get a user's favorited events */