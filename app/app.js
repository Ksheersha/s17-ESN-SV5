var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var chatgroup = require('./routes/groupchat');

var messages = require('./routes/messages');
var helpProvider = require('./routes/helpProvider');
var mongodb = require('./model/mongodb');
var cors = require('cors');
var path = require('path');
var config = require('./config');
mongodb.setup();

global.URI = config.address.URI;
console.log('Enter app.js');

var app = express();
app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.resolve()));
app.use(express.static(path.resolve('app')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(cookieParser());


app.use('/', index);
app.use('/users', users);
app.use('/messages', messages);
app.use('/providers', helpProvider);
app.use('/groupchat',chatgroup);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

exports = module.exports = app;
