const express = require('express');
const passport = require('passport');
const router = express.Router()
const User = require('../models/user')
const Stock = require('../models/stock')
const axios = require('axios')
require('../passport.js')

const {ensureAuth} = require('../middleware/ensureAuth');
const stock = require('../models/stock');

const options = {
    headers: {
        'X-API-KEY': process.env.YF_API_KEY
    }
}

router.get('/buyingPower', ensureAuth,async(req,res)=>{
    try{
        const buyingPower = await req.user.buyingPower
        res.send({"buyingPower":buyingPower})
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
        return res.send({"balance": balance})
    }catch(err){
        console.log("There is an error caught in the endpoint")
        console.log(err)
        return res.status(400).send()
    }
})

router.get('/balance',ensureAuth,async(req,res)=>{
    try{
        const buyingPower = req.user.buyingPower
        
        let assetTotal = 0
        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth()
        let year = date.getFullYear()
        let userStocks = await Stock.find({user:req.user})
        let queryString = ''
        for (let stock = 0; stock<userStocks.length; stock++){
           queryString += `${userStocks[stock].ticker}%2c`
        }

        const res = await axios.get(`https://alpha.financeapi.net/market/get-realtime-prices?symbols=${queryString}`,options)
        res.data.data.forEach(async(stock)=>{
            ticker = new RegExp(stock.id,'i')
            console.log(stock.id)
            let s = await Stock.findOne({ticker: ticker})

            if(s){
                console.log("results found")
            }
            console.log(s.quantity)
            //assetTotal += stock.attributes.last * Stock.findOne({ticker: stock.id}).quantity
            
        })
        let balance = req.user.balance
        console.log(buyingPower + "  "+ assetTotal)
        const newBalance = assetTotal + buyingPower
        balance.push({date: `${month}/${day}/${year}`, balance: newBalance})
        console.log(newBalance)
        await req.user.save()
        //const userBalance = await req.user.balance.save()
        res.send()
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