if (process.argv.length < 4) {
    console.log("server.js <username> <password>");
    process.exit(1);
}

var express = require('express'),
    app     = express(),
    mysql   = require('mysql'),
    bodyParser = require('body-parser'); // for POST 
app.use(bodyParser.urlencoded({ extended: false }));
app.set('port', 3000);
var connectionpool = mysql.createPool({
        host     : 'localhost',
        user     : process.argv[2],
        password : process.argv[3],
        database : 'localhop' });

// Utility functions

function _logError(e) {
    console.error('x error:', e);
}

function _logWarning(w) {
    console.error('! warning:', w);
}

// Error handlers

function handleMysqlConnErr(err, res) {
    _logError(err);
    res.statusCode = 503;
    res.send({
        text: '',
        error: err
        // result: 'error',
        // err: err.code
    });
}

function handleMysqlQueryErr(err, res) {
    _logError(err);
    res.statusCode = 500;
    res.send({
        text: '',
        error: err
        // result: 'error',
        // err: err.code
    });
}

// Server paths

app.get('/', function(req, res){
	res.status(200);
	res.sendFile(__dirname + "/index.html")
});

app.get('/:nodeTest.js', function (req, res) {
        res.status(200);
        res.sendFile(__dirname + "/nodeTest.js")
});

app.get('/get/user/events/:userid', function(req, res) {
    connectionpool.getConnection( function (err, connection) {
        if (err) {
            handleMysqlConnErr(err, res);
        } else {
            qstr = "call getUserEvents(?);";
            args = [req.params.userid];
            connection.query(qstr, args, function(err, rows, fields) {
                if (err) {
                    handleMysqlQueryErr(err, res);
                    return;
                }
                res.send({
                    text: rows[0],
                    error: ''
                    // result: 'success',
                    // err:    '',
                    // fields: fields,
                    // json:   rows,
                    // length: rows.length
                });
                connection.release();
            });
        }
    });
});

app.get('/create/user/group/:userid/:group', function (req, res) {
    connectionpool.getConnection( function (err, connection) {
        if (err) {
            handleMysqlConnErr(err, res);
        } else {
            qstr = "call createUserGroup(?,?);";
            args = [req.params.userid, req.params.group];
            connection.query(qstr, args, function(err, rows, fields) {
                if (err) {
                    handleMysqlQueryErr(err, res);
                    return;
                }
                res.send({
                    text: rows[0],
                    error: ''
                    // result: 'success',
                    // err:    '',
                
                    // json:   rows,
                    // length: rows.length
                });
                connection.release();
            });
        }
    });
});

app.listen(app.get('port'));
