const express = require('express');
const passport = require('passport');
const router = express.Router()
const User = require('../models/user')
require('../passport.js')

const {ensureAuth} = require('../middleware/ensureAuth')
router.get('/buyingPower', ensureAuth,async(req,res)=>{
    try{
        const buyingPower = await req.user.buyingPower
        console.log(buyingPower)
        res.send({buyingPower:buyingPower})
    }catch(err){
        console.log(err)
    }
    
})
module.exports = router