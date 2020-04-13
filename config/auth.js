// req.isAuthenticated() is a method provided by passport, will return true if user is logged in
module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) return next()
    req.flash('warning_msg', '很抱歉，您的連線已過期，請重新登入一次')
    res.redirect('/users/login')
  }
}
