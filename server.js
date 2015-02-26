/** 
 * Local Hop - Backend server "Caboose"
 * 
 * The backend server for Local Hop
 */

"use strict";

if (process.argv.length < 5) {
  console.log("server.js <username> <password> <database>");
  process.exit(1);
}

var express    = require('express'),
    mysql      = require('mysql'),
    bodyParser = require('body-parser'), // for POST 
    _          = require('underscore'),
    app        = express(),
    connpool = mysql.createPool({
    	host : process.argv[2],
    	user : process.argv[3],
    	password : process.argv[4],
    	database : process.argv[5]
    });

app.set('port', 3000);
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/', function(req, res, next) {
// 	res.type('json'); // This server returns only JSON requests
// });

///////////////////////////////////////////////////////////////////////////////
/// Utility functions
///////////////////////////////////////////////////////////////////////////////

function _error(e) { console.error('x error:', e); }

function _warning(w) { console.error('! warning:', w); }

function _debug(m) { console.log('> debug: ', m); }

///////////////////////////////////////////////////////////////////////////////
/// Error handlers
///////////////////////////////////////////////////////////////////////////////

function handleMysqlConnErr(err, res) {
  _error(err);
  res.statusCode = 503;
  res.type('json');
  res.send({text: '', error: err});
}

function handleMysqlQueryErr(err, res) {
  _error(err);
  res.statusCode = 500;
  res.type('json');
  res.send({text: '', error: err});
}

///////////////////////////////////////////////////////////////////////////////
/// Server paths
///////////////////////////////////////////////////////////////////////////////

app.get('/', function(req, res){
	res.status(200);
	res.sendFile(__dirname + "/index.html")
});


/** Events */


app.post('/create/event/', function (req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.body.name, 
                  req.body.description, 
                  req.body.location, 
                  req.body.inviteSetting, 
                  req.body.start, 
                  req.body.end, 
                  req.body.userid]; 
      var query = "call createEvent(?,?,?,?,?,?,?);";
      conn.query(query, args, function (err, rows) {
        conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          res.status = 200;
          res.type('json');
          res.send({text: rows[0], error: ''});
        }
      });
    }
  });
});

app.get('/get/event/users/:eventid/:attendStatus', function(req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var query = "call getEventUsers(?,?);";
      var args = [req.params.eventid, req.params.attendStatus];
      conn.query(query, args, function(err, rows) {
        conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          res.status = 200;
          res.type('json');
          res.send({text: rows[0], error: ''});
        }
      });
    }
  });
});


/** Users */


app.get('/get/user/events/:userid', function(req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.params.userid];
      var query = "call getUserEvents(?);";
      conn.query(query, args, function(err, rows) {
      	conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          res.status = 200;
          res.type('json');
	        res.send({text: rows[0], error: ''});
	      }
      });
    }
  });
});

app.get('/get/user/event/favorites/:userid', function(req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.params.userid];
      var query = "call getUserEventFavorites(?);";
      conn.query(query, args, function(err, rows) {
        conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          res.status = 200;
          res.type('json');
          res.send({text: rows[0], error: ''});
        }
      });
    }
  });
});

app.get('/get/user/by/phonenumber/:phoneNumber', function(req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      console.log(req.params);
      var args = req.params.phoneNumber;
      var query = "call getUserByPhoneNumber(?);";
      conn.query(query, args, function(err, rows) {
        conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          res.status = 200;
          res.type('json');
          res.send({text: rows[0], error: ''});
        }
      });
    }
  });
});


/** Groups */


app.get('/create/user/group/:userid/:group', function (req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.params.userid, req.params.group];
      var query = "call createUserGroup(?,?);";
      conn.query(query, args, function(err, rows, fields) {
      	conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          res.status = 200;
          res.type('json');
	        res.send({text: rows[0], error: ''});
	      }
      });
    }
  });
});

app.get('/add/group/user/:groupid/:userid', function (req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.params.groupid, req.params.userid];
      var query = "call addGroupUser(?,?);";
      conn.query(query, args, function (err, rows, fields) {
        conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          res.status = 200;
          res.type('json');
          res.send({text: rows[0], error: ''});
        }
      });
    }
  });
});


app.listen(app.get('port'));
console.log("Server listening on port "+app.get('port')+"...");