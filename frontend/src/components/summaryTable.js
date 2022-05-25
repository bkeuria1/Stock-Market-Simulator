import React, {useState,useEffect,useContext} from 'react'
import axios from 'axios'
import './table.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UserStocksContext } from '../context/userStocksContext'
import {  faRefresh } from '@fortawesome/free-solid-svg-icons'
import {Button,Table,Card} from 'react-bootstrap';
import { BuyingPowerContext } from '../context/buyingPowerContext'

const SummaryTable = (props)=>{
    //const [userStocks,setUserStocks] = useState([])
    const [currentPrices,setCurrentPrices] = useState([])
    const [stockWithPrices, setStockWithPrices] = useState([])
    const [totalGains,setTotalGains] = useState(0)
    const [totalAssets,setTotalAssets] = useState(0)
    const {getUserStocks,userStocks} = useContext(UserStocksContext)
    const {getBuyingPower, buyingPower} = useContext(BuyingPowerContext)
    const SECOND = 1000
    const MINUTES = SECOND * 60

    let realTimePriceURL
    if(process.env.REACT_APP_MODE === 'dev'){
        realTimePriceURL = REACT_APP_REALTIME_URL_DEV
    }else{
        realTimePriceURL = REACT_APP_REALTIME_URL_PROD
    }
    //refresh table every 10 minutes
    useEffect(()=>{
        const timeId = setTimeout(() => {
          // After 3 seconds set the show value to false
          getCurrentPrices()
        }, MINUTES * 10)
  
        return () => {
          clearTimeout(timeId)
        }
     })

    useEffect(()=>{
        setCurrentPrices([])
        setStockWithPrices([])
        getCurrentPrices()  
        
    },[JSON.stringify(userStocks)])

    useEffect(()=>{
        if(userStocks.length>0){
            addPrice()     
        } 
    },[JSON.stringify(currentPrices)])

    useEffect(()=>{
        getTotals()
    },[JSON.stringify(stockWithPrices)])


   const getTotals = ()=>{
       let tempTotalGains = 0
       let tempTotalAssets = 0
       stockWithPrices.forEach(stock=>{
            tempTotalAssets += stock.total
            tempTotalGains += stock.price*stock.quantity-stock.total
       })
       setTotalGains(tempTotalGains)
       setTotalAssets(tempTotalAssets)
   }

    const getCurrentPrices = async()=>{
        let queryString = ''
        if(userStocks.length>0){
            userStocks.forEach(stock=>{
                queryString+=`${stock.ticker}%2c`
            })
           
            
            const res = await axios.get(`${realTimePriceURL}?stock=${queryString}`,{withCredentials:true})
            let tempPrices = []
            // for( let i = 0; i<20; i++){
            //     tempPrices.push(Math.random())
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
        <div style={{ width: "40%",float: 'right', marginTop: '4.0rem'}}>
            <Button variant = "primary" onClick={getCurrentPrices}>
                Refresh <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon>
            </Button>

            <Card style = {{marginTop :'1.5rem'}}>
            <Card.Body>
               <Card.Title>Balane Summary</Card.Title>
                <Card.Text>
                    Cash Balance: {buyingPower}
                </Card.Text>
                <Card.Text style = {{color: totalGains>0 ? 'green': 'red'}}>
                    Total Gains/Loses: {totalGains.toFixed(2)}
                </Card.Text>
                <Card.Text>
                    Total Assets: {totalAssets}
                </Card.Text>
                <Card.Text style = {{fontWeight:'bold'}}>
                    Total Balance: {(totalAssets+buyingPower+totalGains).toFixed(2)}
                </Card.Text>
            </Card.Body>
            </Card>
          
            {stockWithPrices.length>0 && (
                <div style = {{marginTop: '2rem', overflowY: 'scroll', height: '500px'}}>
                    <Table  bordered hover>
                        <tr>
                            <th>Symbol</th>
                            <th>Shares</th>
                            <th>Total</th>
                            <th>Average Purchase Price</th>
                            <th>Current Price</th>
                            <th>Gains/Loses</th>
                        </tr>
                            <tbody>
                                {stockWithPrices.reverse().map(stock=>{
                                        return(
                                            <tr onClick={()=>props.setStock(stock.ticker)}>
                                                <td>{stock.ticker.toUpperCase()}</td>
                                                <td>{stock.quantity}</td>
                                                <td>${stock.total}</td>
                                                <td>${(stock.total/stock.quantity)}</td>
                                                <td>{stock.price}</td>
                                                <td style ={{color: stock.price*stock.quantity-stock.total>0 ? 'green' : 'red'}}>${(stock.price*stock.quantity-stock.total).toFixed(2)}</td>
                                            </tr>
                                        )
                                    })}
                                
                            </tbody>
                    </Table>
                </div>
            )
            }

        </div>
    )
}
export default SummaryTable