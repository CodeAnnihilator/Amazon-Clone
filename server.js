var express = require('express');
var morgan = require('morgan'); // logs
var mongoose = require('mongoose'); // Mongo Connection
var bodyParser = require('body-parser'); // Parse data to JSON
var ejs = require('ejs');
var engine = require('ejs-mate'); // templating engine
var session = require('express-session'); // Creates token
// var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session); // Stores token into a database
var passport = require('passport');

var secret = require('./config/secret');
var User = require('./models/user');

var app = express();

mongoose.connect(secret.database, function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('Connected to the database');
  }
})

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({
    url: secret.database,
    autoReconnect: true
  })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
app.use(mainRoutes);
app.use(userRoutes);



app.listen(secret.port, function(err) {
  if(err) throw err;
  console.log('Server is running on port ' + secret.port);
})
