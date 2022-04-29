
const express = require('express');
const passport = require('passport');
const axios = require('axios')
const router = express.Router()
const User = require('../models/user')
const Stock = require('../models/stock')

require('../passport.js')

const {ensureAuth} = require('../middleware/ensureAuth');
const options = {
    headers: {
        'X-API-KEY': process.env.YF_API_KEY
    }
};
router.get('/chart', ensureAuth, async(req,res)=>{
    console.log(req.query.stock + " "+ req.query.timeFrame)
    console.log(JSON.stringify(options))

    const url = `https://alpha.financeapi.net/symbol/get-chart?period=${req.query.timeFrame}&symbol=${req.query.stock}`

    try{
        console.log("api called")
        const results = await axios.get(url,options)

        res.send(results.data)
    }catch(err){
        console.log(err)
        res.status(400).send()
    }
})

router.get('/realtimePrice',ensureAuth, async(req,res)=>{
    const url = `https://alpha.financeapi.net/market/get-realtime-prices?symbols=${req.query.stock}`
    try{
        const results = await axios.get(url,options)
        res.send(results.data)
    }catch(err){
        //console.log(err)
        res.status(400).send()
    }
})
router.get('/userStocks', ensureAuth, async (req,res)=>{
    try{
        const userStocks = await Stock.find({user: req.user })
        res.send(userStocks)
    }catch(err){
        res.send(err).status(400)

    }
})



module.exports = router