var request = require('request');
var localhost  = "http://localhost:3000"
var remotehost = ""; 
var host = localhost;

function callback(error, response, body) {
  if (!error  && response.statusCode == 200) {
    console.log(body);
  } else {
    console.log(error);
  }
}

// /** Create a user */
// var testUser = {
// 	email:"donttestmeeveragin@mailinator.com",
// 	password:"testpass",
// 	phoneNumber:"1334217850",
// 	firstName:"Untestinger",
// 	lastName:"User",
//   profileImageURL:"http://localhop.com/images/user/default-profile.jpg"};
// //request.post(host+"/add/user", callback).form(testUser);

// var loginTestUser = {
//   password: "fakepass",
//   phoneNumber: "19132540937"
// };
// request.post(host+"/user/login/", callback).form(loginTestUser);

// /** Get a user's events */
// var userid = 3;
// request.get(host+"/get/user/events/"+userid, callback);

// /** Get a user's favorited events */
// request.get(host+"/get/user/event/favorites/"+userid, callback);

// /** Get a user using their phone number */
// var phoneNumber = "19132540937";
// request.get(host+"/get/user/by/phonenumber/"+phoneNumber, callback);

request.post(host+"/user/location/", callback).form({
  userId: 1,
  latitude: "+40.689060",
  longitude: "-74.044636"
});