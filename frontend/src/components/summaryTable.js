import React, {useState,useEffect,useContext} from 'react'
import axios from 'axios'
const SummaryTable = ()=>{
    const [userStocks,setUserStocks] = useState([])
    const [currentPrices,setCurrentPrices] = useState([])
    const [stockWithPrices, setStockWithPrices] = useState([])
    useEffect(()=>{
        getUserStocks()
    },[JSON.stringify(userStocks)])

    useEffect(()=>{
        getCurrentPrices()  
    },[JSON.stringify(userStocks)])

    useEffect(()=>{
        if(userStocks.length>0){
            addPrice() 
        } 
    },[JSON.stringify(currentPrices)])


    const getUserStocks = async()=>{
        const res = await axios.get('http://localhost:3001/stock/userStocks',{withCredentials:true})
        setUserStocks(res.data)
    }

    const getCurrentPrices = async()=>{
        
        let queryString = ''
        if(userStocks.length>0){
            userStocks.forEach(stock=>{
                queryString+=`${stock.ticker}%2c`
            })
           
            const res = await axios.get(`http://localhost:3001/stock/realtimePrice?stock=${queryString}`,{withCredentials:true})
            console.log(res.data)
             let tempPrices = []
            // for(let i =0;i<10;i++){
            //     tempPrices.push(i)
            // }
            res.data.data.forEach(stock=>{
                console.log(stock.attributes.last)
                tempPrices.push(stock.attributes.last)
            })
            setCurrentPrices(tempPrices)
        }
    }
    const addPrice = async()=>{
    
        let tempStockInfo = JSON.parse(JSON.stringify(userStocks)) //creating a deep copy
        tempStockInfo.forEach((stock, index)=> {
            const price = currentPrices[index]
            stock.price = price
          });
          setStockWithPrices(tempStockInfo)
    }
    return(
        <div>
            <i class="fa fa-refresh" aria-hidden="true"></i>
        {stockWithPrices.length>0 && (
            
            <table class = "table table-striped">
                <tr>
                    <th>Symbol</th>
                    <th>Shares</th>
                    <th>Total</th>
                    <th>Average Purchase Price</th>
                    <th>Current Price</th>
                    <th>Gains/Loses</th>
                </tr>
                    <tbody>
                        {stockWithPrices.map(stock=>{
                                return(
                                    <tr>
                                        <td>{stock.ticker}</td>
                                        <td>{stock.quantity}</td>
                                        <td>${stock.total}</td>
                                        <td>${stock.total/stock.quantity}</td>
                                        <td>{stock.price}</td>
                                        <td>${stock.price*stock.quantity-stock.total }</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td>hello</td>
                            </tr>
                    </tbody>
    

            </table>
        )
        }
        </div>
    )
}
export default SummaryTable