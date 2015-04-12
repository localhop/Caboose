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
    name: "Big Bubba's Barbecue Bash",
    description: "Barbecue bash at big Bubba's. You better be barbecuing baby back ribs!",
    location: "1603 West 15th Street. Jayhawker Towers Apt. A Room 211",
    inviteSetting: '1',
    start: "2015-03-9",
    end: "2015-03-10",
    userID: "1"};
request.post(host+"event/add", callback).form(testEvent);

/** Get all users attending an event with an attend status of 1 */
for (var eventid = 1; eventid<=9; eventid++) {
  console.log("requesting users for event ", eventid);
  request.get(host+"event/users/"+eventid+"/1", callback);
}
