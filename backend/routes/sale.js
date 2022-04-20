const express = require('express');
const passport = require('passport');
const router = express.Router()
const Stock = require('../models/stock')
const User = require('../models/user')
require('../passport.js')

const {ensureAuth} = require('../middleware/ensureAuth')
router.get('/symbol/chart', ensureAuth,(req, res) => {
    res.send('<h1>Log in Failed :(</h1>')
  });

  router.post('/buy', ensureAuth,async(req,res)=>{
    const user = req.user
    const buyingPower = req.user.buyingPower
    const total = req.body.total
  
    let stock = new Stock(req.body)
    stock.user = user
    if(buyingPower<total){
      res.status(400).send("You Dont have enough buying power")
    }
    try{
      console.log(req.body)
      const saveStockRes = await stock.save()
      user.buyingPower -=total
      await user.save()
      console.log(user.buyingPower)
      res.status(200).send("Purchase is Completed")
    }catch(err){
      console.log(err)
      res.status(400).send("There was an error with your purchase")
    }
    
    
  })

module.exports = router