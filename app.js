var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var app = express();
require('dotenv').config();

// require routes
var index = require('./routes/index');
var database = require('./routes/database');
var users = require('./routes/users');
var slack = require('./routes/slack');
var shoots = require('./routes/shoots');
var transcode = require('./routes/transcode');
var theworkflow = require('./routes/theworkflow');
var m2s = require('./routes/m2s');
var rename = require('./routes/rename');
var tests = require('./routes/tests');

var mongoDB = process.env.MONGODB_URL;
// var mongoDB = process.env.MONGODB_URL_DEV;

const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
const { matchedData, sanitize } = require('express-validator/filter');


console.log("mongoDB url is " + mongoDB);
mongoose.connect(mongoDB);
var db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('json spaces', 4);
app.set('json replacer', null);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

app.use('/', index);
app.use('/users', users);
app.use('/slack', slack);
app.use('/theworkflow', theworkflow);
app.use('/shoots', shoots);
app.use('/m2s', m2s);
app.use('/rename', rename);
app.use('/tests', tests);
app.use('/transcode', transcode);
app.use('/database', database);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
