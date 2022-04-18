
const express = require('express');
const passport = require('passport');
const router = express.Router()
const User = require('../models/user')
const Stock = require('../models/stock')

require('../passport.js')

const {ensureAuth} = require('../middleware/ensureAuth')
router.get('/userStocks', ensureAuth, async (req,res)=>{
    try{
        const userStocks = await Stock.find({user: req.user })
        res.send(userStocks)
    }catch(err){
        res.send(err).status(400)

    }
})

module.exports = router