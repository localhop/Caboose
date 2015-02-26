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

/** Create Event */
var testEvent = {
    name: "TestEvent", 
    description: "This is a test event",
    location: "1603 West 15th Street. Jayhawker Towers Apt. A Room 211",
    inviteSetting: '1',
    start: "2015-03-01",
    end: "2015-03-02",
    userid: "1"};
request.post(host+"create/event", callback).form(testEvent);

/** Get a user's events */
var userid = 3;
request.get(host+"get/user/events/"+userid, callback);

/** Get all users attending an event with an attend status of 1 */
for (var eventid = 0; eventid<=9; eventid++) {
  request.get(host+"get/event/users/"+eventid+"/1", callback);
}