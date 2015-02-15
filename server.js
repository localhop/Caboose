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
    app        = express(),
    connpool = mysql.createPool({
    	host : 'localhost',
    	user : process.argv[2],
    	password : process.argv[3],
    	database : process.argv[4]
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
  res.send({text: '', error: err});
}

function handleMysqlQueryErr(err, res) {
  _error(err);
  res.statusCode = 500;
  res.send({text: '', error: err});
}

///////////////////////////////////////////////////////////////////////////////
/// Server paths
///////////////////////////////////////////////////////////////////////////////

app.get('/', function(req, res){
	res.status(200);
	res.sendFile(__dirname + "/index.html")
});

app.get('/:nodeTest.js', function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/nodeTest.js")
});

app.get('/get/user/events/:userid', function(req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      qstr = "call getUserEvents(?);";
      args = [req.params.userid];
      conn.query(qstr, args, function(err, rows, fields) {
      	conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
	        res.send({text: rows[0], error: ''});
	      }
      });
    }
  });
});

app.get('/create/user/group/:userid/:group', function (req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      qstr = "call createUserGroup(?,?);";
      args = [req.params.userid, req.params.group];
      conn.query(qstr, args, function(err, rows, fields) {
      	conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
	        res.send({text: rows[0], error: ''});
	      }
      });
    }
  });
});

app.listen(app.get('port'));