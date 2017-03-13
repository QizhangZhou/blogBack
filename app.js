var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var fallback = require('express-history-api-fallback');

/*var Router = require('react-router');
var React = require('react');
var routes = require('./public/src/index');
var swig = require('swig');*/

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var settings = require('./setting');


// view engine setup
app.set('.html',require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.ejs');
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret:settings.cookieSecret,
    key:settings.db,
    cookie:{maxAge:1000*60*60*24*30},//30 days
    store:new MongoStore({
      db:settings.db,
        host:settings.host,
        port:settings.post,
        url:settings.url
    })
}));
/*app.use(function(req, res) {
    Router.run(routes, req.path, function(Handler) {
        var html = React.renderToString(React.createElement(Handler));
        var page = swig.renderFile('views/index.html', { html: html });
        res.send(page);
    });
});*/
const root = __dirname+'/public';
app.use(express.static(path.join(__dirname, 'public')));
app.use(fallback('index.html', {root: root }));
//app.use(express.methodOverride());

app.use('/', index);
app.use('/users', users);

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
