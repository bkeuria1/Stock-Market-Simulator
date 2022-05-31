const axios = require('axios')
const cron = require('node-cron');
const User = require('./models/user')
const Stock = require('./models/stock')
const passport = require('passport');

const options = {
    headers: {
        'X-API-KEY': process.env.YF_API_KEY
    }
}

const calculateBalance = async ()=>{
    try{
        const allUsers = await User.find({})
       
        for(const user of allUsers){
          
            let totalAssets = 0
            const buyingPower = user.buyingPower
            let userStocks = await Stock.find({user:user})
            let queryString = ''
            if(userStocks.length>0){
                userStocks.forEach(stock =>{
                    queryString += `${stock.ticker}%2c`
                })
                const res = await axios.get(`https://alpha.financeapi.net/market/get-realtime-prices?symbols=${queryString}`,options)
                for(const stock of res.data.data){
                    ticker = new RegExp(stock.id,'i')
                    console.log(stock.id)
                    let currentPrice = stock.attributes.last
                    console.log("Heres the current price " + currentPrice)
                    let stockDB = await Stock.findOne({ticker: ticker, user:user})
                    totalAssets += (stockDB.total + (currentPrice*stockDB.quantity-stockDB.total))
                    
                
                }
                let currentBalance = buyingPower + totalAssets
                user.balance.push({date: getDate(), balance: currentBalance})
                await user.save()
                user.balance.forEach(obj =>{
                    console.log(obj.date + " "+obj.balance)
                })
            }                                                                   
        };
    
    
    }catch(err){
        console.log(err)
    }
}

const getDate = ()=>{
    const today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    return date 

}

// if(process.env.NODE_ENV === 'dev'){
//     const task = cron.schedule('* * * * *', () => {
//         //module.exports = task
//         //calculateBalance()
//       });
// }else{
//     calculateBalance()
// }
//calculateBalance()
calculateBalance()