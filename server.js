/** 
 * Local Hop - Backend server "Caboose"
 * 
 * The backend server for Local Hop
 */

"use strict";

if (process.argv.length < 6) {
  console.log("server.js <host> <username> <password> <database>");
  process.exit(1);
}

var express    = require('express'),
    mysql      = require('mysql'),
    bodyParser = require('body-parser'), // for POST 
    _          = require('underscore'),
    app        = express(),
    colors     = require('colors'),
    connpool = mysql.createPool({
      host : process.argv[2],
      user : process.argv[3],
      password : process.argv[4],
      database : process.argv[5],
      timezone : 'utc'
    });

app.set('port', 3000);
app.use(bodyParser.urlencoded({ extended: false }));

///////////////////////////////////////////////////////////////////////////////
/// Debug utility functions
///////////////////////////////////////////////////////////////////////////////

function error(e) { 
  console.error('ERROR:'.bgRed.black, e); 
}

function warning(w) { 
  console.error('WARNING:'.bgYellow.black, w); 
}

function debug(d) { 
  console.log('DEBUG:'.bgBlue.black, d); 
}

function log(msg) { 
  console.log(msg); 
}


///////////////////////////////////////////////////////////////////////////////
/// Error handlers
///////////////////////////////////////////////////////////////////////////////

function handleMysqlConnErr(err, res) {
  error(err);
  res.statusCode = 200;
  res.type('json');
  res.send({text: '', error: err});
}

function handleMysqlQueryErr(err, res) {
  error(err);
  res.statusCode = 200;
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


// add parameters for latitude and longitude.
app.post('/event/add', function (req, res) {
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
                  req.body.userID];
      var query = "call addEvent(?,?,?,?,?,?,?);";
      conn.query(query, args, function (err, rows) {
        conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          res.status = 200;
          res.type('json');
          res.send({text: rows['affectedRows'], error: ''});
        }
      });
    }
  });
});

app.get('/event/users/:eventID', function(req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var query = "call getEventUsers(?);";
      var args = [req.params.eventID];
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


app.post('/user/login', function(req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.body.phoneNumber,
                  req.body.password];
      var query = "call getUserByAuthenticationKeys(?,?);";
      conn.query(query, args, function(err, rows) {
        conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          debug(rows[0][0]);
          res.status = 200;
          res.type('json');
          res.send({text: rows[0][0], error: ''});
        }
      });
    }
  });
});

app.post('/user/location', function(req, res) {
  debug(req.body);
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.body.userID, req.body.latitude, req.body.longitude];
      var query = "call setUserLocation(?,?,?);";
      conn.query(query, args, function(err, rows) {
        conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          debug(rows);
          res.status = 200;
          res.type('json');
          res.send({text: 'success', error: ''});
        }
      });
    }
  });  
});

app.post('/user/add', function(req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.body.email,
                  req.body.password,
                  req.body.phoneNumber,
                  req.body.firstName,
                  req.body.lastName,
                  req.body.profileImageURL];
      var query = "call addUser(?,?,?,?,?,?);";
      conn.query(query, args, function(err, rows) {
        conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          debug(rows);
          res.status = 200;
          res.type('json');
          res.send({text: 'success', error: ''});
        }
      });
    }
  });
});

app.get('/user/events/:userID', function(req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.params.userID];
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

app.get('/user/event/favorites/:userID', function(req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.params.userID];
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

app.get('/user/from/phonenumber/:phoneNumber', function(req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      debug(req.params);
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

app.get('/user/groups/:userID', function (req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.params.userID];
      var query = "call getUserGroups(?);";
      conn.query(query, args, function(err, rows, fields) {
        conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          var results = rows[0],
              groups  = {};

          for (var i in results) {
            var row = results[i];
            if (!groups[row['group_id']]) {
              groups[row['group_id']] = {
                'name' : row['name'],
                'members' : []
              };
            }
            groups[row['group_id']]['members'].push({
              'id' : row['user_id'],
              'name_first' : row['name_first'],
              'name_last' : row['name_last']
            });
          }
          res.status = 200;
          res.type('json');
          res.send({text: groups, error: ''});
        }
      });
    }
  });
});

app.get('/user/friends/:userID', function (req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.params.userID];
      var query = "call getUserFriends(?);";
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


/** Groups */


app.post('/user/add/group/:userID/:group', function (req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.body.userID, req.body.group];
      var query = "call addUserGroup(?,?);";
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

app.get('/user/groups/:userID', function (req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.params.userID];
      var query = "call getUserGroups(?);";
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

app.get('/group/users/:groupID', function (req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.params.groupID];
      var query = "call getGroupUsers(?);";
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

app.post('/group/add/user/:groupID/:userID', function (req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var args = [req.body.groupID, req.body.userID];
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
log("Server listening on port "+app.get('port')+"...");
