const axios = require('axios')
const cron = require('node-cron');

const calculateBalance = async ()=>{
    try{
        let assetTotal
        const buyingPower = await axios.get(process.env.BUYINGPOWER_URL, {withCredentials:true})
        const userStocks = await axios(process.env.USERSTOCK_URL, {withCredentials:true}) 
        let queryString = ''
        userStocks.forEach(stock=>{
            queryString+=`${stock.ticker}%2c`
        })
        const res = await axios.get(`${process.env.REALTIME_URL}?stock=${queryString}`,{withCredentials:true})
        res.data.data.forEach(stock=>{
            assetTotal += stock.attributes.last
        })
        let date = new Date()
        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();

let fullDate = `${day}.${month}.${year}.`;
        const newBalance = {date: Date.now(),} 
    }catch(err){
        console.log(err)
    }
}
const task = cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});

module.exports = task
