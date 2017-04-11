require('dotenv').config({silent: true})
var isLoggedIn = require('./middleware/isLoggedIn')
var express = require('express')
var ejsLayouts = require('express-ejs-layouts')
var bodyParser = require('body-parser')
var session = require('express-session')
var mongoose = require('mongoose')
var passport = require('./config/ppConfig')
var flash = require('connect-flash')

var app = express()

if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/plaza-verde')
} else {
  mongoose.connect('mongodb://localhost/plaza-verde-test')
}

app.set('view engine', 'ejs')

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(ejsLayouts)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(function (req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile')
})

app.use('/auth', require('./controllers/auth'))

var server
if (process.env.NODE_ENV === 'test') {
  server = app.listen(process.env.PORT || 5000)
} else {
  server = app.listen(process.env.PORT || 3000)
}
console.log(process.env);
module.exports = server
