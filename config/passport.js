const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user.js')
const bcrypt = require('bcryptjs')

// Before authenticating requests, the strategy (or strategies) used by an application must be configured.
module.exports = (passport) => {
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) return done(err)
      if (!user) return done(null, false)
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return console.log(err)
        if (!isMatch) return done(null, false)
        return done(null, user) // 會把 user 存在 req.user 裡
      })
    })
  }))

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, cb) => {
    User.findOne({ email: profile._json.email })
      .then((user) => {
        if (!user) {
          // 產生密碼
          const randomPassword = Math.random().toString(36).slice(-8)
          bcrypt.genSalt(10, (err, salt) => {
            if (err) return console.log(err)
            bcrypt.hash(randomPassword, salt, (err, hash) => {
              if (err) return console.log(err)
              const newUser = new User({
                name: profile._json.name,
                email: profile._json.email,
                password: hash
              })
              newUser.save()
                .then((user) => cb(null, user))
                .catch((err) => console.log(err))
            })
          })
        } else return cb(null, user)
      })
      .catch((err) => console.log(err))
  }))

  // Passport will maintain persistent login sessions. In order for persistent sessions to work, the authenticated user must be serialized to the session, and deserialized when subsequent requests are made.
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    // User.findById(id, function (err, user) {
    //   done(err, user)
    // })
    // Handlebars: Access has been denied to resolve the property "username" because it is not an "own property" of its parent. You can use following code to let template use user Object
    User.findById(id)
      .lean()
      .exec((err, user) => {
        done(err, user)
      })
  })
}
