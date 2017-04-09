var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var User = require('../models/user')

/*
 * Passport "serializes" objects to make them easy to store, converting the
 * user to an identifier (id)
 */
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

/*
 * Passport "deserializes" objects by taking the user's serialization (id)
 * and looking it up in the database
 */
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, done) {
  User.findOne({email: email}, function (err, user) {
    if (err) return done(err)

    // if no user is found
    if (!user) return done(null, false)

    // check if the password is correct
    if (!user.validPassword(password)) return done(null, false)

    return done(null, user)
  })
}))

module.exports = passport
