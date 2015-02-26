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
//request.get(host+"get/user/events/"+userid, callback);

/** Get a user's favorited events */
//request.get(host+"get/user/event/favorites/"+userid, callback);

/** Get a user using their phone number */
var phoneNumber = "19132540937";
request.get(host+"get/user/by/phonenumber/"+phoneNumber, callback);