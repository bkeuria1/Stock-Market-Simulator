const express = require('express');
const passport = require('passport');
const router = express.Router()
const User = require('../models/user')
const Stock = require('../models/stock')
require('../passport.js')

const {ensureAuth} = require('../middleware/ensureAuth');
const stock = require('../models/stock');
router.get('/buyingPower', ensureAuth,async(req,res)=>{
    try{
        const buyingPower = await req.user.buyingPower
        res.send({buyingPower:buyingPower})
    }catch(err){
        console.log(err)
    }
    
})

router.get('/reset',ensureAuth,async(req,res)=>{
    console.log("Post made")
    try{
        req.user.buyingPower = 1000000
        await req.user.save()
        const stocks = await Stock.find({user:req.user})
        await Stock.deleteMany({user:req.user})
        res.send("Profile reset")
    }catch(err){
        conssole.log(err)
        res.status(400).send("Could not reset profile")
    }
})

router.get('/balance',ensureAuth,async(req,res)=>{
    try{
        const balance = req.user.balance
        return res.send({buyingPower:buyingPower})
    }catch(err){
        console.log(err)
        return res.status(400).send()
    }
})

router.put('/balance',ensureAuth,async(req,res)=>{
    try{
      const date = req.body.date
      const balance = req.body.balance
      const userBalance = req.user.balance
      userBalance.push({date:date, balance:balance})
      userBalance.save( )
    }catch(err){
        console.log(err)
        return res.status(400).send()
    }
})


router.delete('/delete',ensureAuth,async(req,res)=>{
    const user = req.user
    console.log(user)
    try{
        await user.delete()
        return res.send()
    }catch(err){
        console.log(err)
    }


})

module.exports = router