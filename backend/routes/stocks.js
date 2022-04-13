const express = require('express');
const passport = require('passport');
const router = express.Router()
require('../passport.js')

const {ensureAuth} = require('../middleware/ensureAuth')
router.get('/symbol/chart', ensureAuth,(req, res) => {
    res.send('<h1>Log in Failed :(</h1>')
  });

module.exports = router