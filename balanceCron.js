
const axios = require('axios')
const User = require('./backend/models/user')
const Stock = require('./backend/models/stock')
//const passport = require('passport');
const options = {
    headers: {
        'X-API-KEY': process.env.YF_API_KEY
    }
}

const calculateBalance = async ()=>{

    console.log("Balance called")
    try{
        const allUsers = await User.find({})
        console.log(allUsers.length)
        for(const user of allUsers){
            console.log("The user is "+ user.displayName)
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
                    let ticker = new RegExp(`^${stock.id}`,'i')
                    let currentPrice = stock.attributes.last
                    let stockDB = await Stock.findOne({ticker: ticker, user:user})

                    let stockAmount = (stockDB.total + (currentPrice*stockDB.quantity-stockDB.total))
                    //console.log(`Heres the current price for ${stock.id}: ${currentPrice} with quantity of ${stockDB.quantity} and amount ${stockAmount}`)
                    totalAssets += stockAmount
                    console.log(totalAssets)
                    
                
                }
            }
            let currentBalance = buyingPower + totalAssets
            console.log("Total Assets: " + totalAssets)
            console.log("Current Balance" + currentBalance)
            user.balance.push({date: getDate(), balance: currentBalance})
            await user.save()
                                                                               
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
calculateBalance()
//process.exit();