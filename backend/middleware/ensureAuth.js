module.exports = {
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) {
        console.log("Is  authenticated")
        next()
      } else {
        console.log("Not Authenticated")
        res.status(401).send()
      }
    }
}