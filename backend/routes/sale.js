const express = require('express');
const passport = require('passport');
const router = express.Router()
const Stock = require('../models/stock')
const User = require('../models/user')
require('../passport.js')

const {ensureAuth} = require('../middleware/ensureAuth');
const user = require('../models/user');
router.post('/buy', ensureAuth,async(req,res)=>{
  const user = req.user
  const buyingPower = req.user.buyingPower
  const total = req.body.total

  let stock = new Stock(req.body)
  stock.user = user
  if(buyingPower<total){
    return res.status(400).send()

  }
  try{
    const currentStock = await Stock.findOne({user:req.user, ticker:req.body.ticker})
    if(currentStock){
      currentStock.quantity += req.body.quantity
      currentStock.total += req.body.total
      currentStock.save()
    }else{
      stock.save()
    }
    
    user.buyingPower -= total
    await user.save()
    res.status(200).send("Purchase is Completed")
  }catch(err){
    res.status(400).send("There was an error with your purchase")
  }
  
  
})

router.patch('/sell', ensureAuth, async(req,res)=>{
  const user = req.user
  
  try{
    const currentStock = await Stock.findOne({user:req.user, ticker:req.body.ticker})
    if(req.body.quantity>currentStock.quantity){
      return res.status(400).send()
      
    }
    if(currentStock.quantity === req.body.quantity){
      user.buyingPower += req.body.total
      user.save()
      await Stock.deleteOne(currentStock)
      return res.send()
    
    }
    currentStock.quantity -= req.body.quantity
    currentStock.total -= req.body.total
    currentStock.save()
    res.send()
    
  }catch(err){
    res.status(400).send()

  }
})

module.exports = router