import React, {useState,useEffect,useContext} from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UserStocksContext } from '../context/userStocksContext'
import {  faRefresh } from '@fortawesome/free-solid-svg-icons'
import {Button,Table,Card} from 'react-bootstrap';
import { BuyingPowerContext } from '../context/buyingPowerContext'

const SummaryTable = (props)=>{
    //const [userStocks,setUserStocks] = useState([])
    const [currentPrices,setCurrentPrices] = useState([])
    const [stockWithPrices, setStockWithPrices] = useState([])
    const [total,setTotal] = useState(0)
    const {getUserStocks,userStocks} = useContext(UserStocksContext)
    const {getBuyingPower, buyingPower} = useContext(BuyingPowerContext)

    useEffect(()=>{
        getCurrentPrices()  
    },[JSON.stringify(userStocks)])

    useEffect(()=>{
        if(userStocks.length>0){
            addPrice() 
        } 
    },[JSON.stringify(currentPrices)])

    useEffect(()=>{
        getTotal()
    },[JSON.stringify(stockWithPrices)])


   const getTotal = ()=>{
       let tempTotal = 0
       stockWithPrices.forEach(stock=>{
            tempTotal += stock.price*stock.quantity-stock.total
       })
       setTotal(tempTotal)
   }

    const getCurrentPrices = async()=>{
        let queryString = ''
        if(userStocks.length>0){
            userStocks.forEach(stock=>{
                queryString+=`${stock.ticker}%2c`
            })
           
            
            const res = await axios.get(`http://localhost:3001/stock/realtimePrice?stock=${queryString}`,{withCredentials:true})
            let tempPrices = []
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
        <div style={{ width: "50%",float: 'right'}}>

            <Card>
            <Card.Body>
               <Card.Title>Current Balance</Card.Title>
                <Card.Text>
                    Cash Balance:{buyingPower}
                </Card.Text>
                <Card.Text>
                    Portfolio Balance: {total}
                </Card.Text>
                <Card.Text>
                    Total Balance: {total+buyingPower}
                </Card.Text>
            </Card.Body>
            </Card>
            <Button variant = "primary" onClick={getCurrentPrices}>
                Refresh <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon>
            </Button>
           
            {stockWithPrices.length>0 && (
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
                            {stockWithPrices.map(stock=>{
                                    return(
                                        <tr onClick={()=>props.setStock(stock.ticker)}>
                                            <td>{stock.ticker}</td>
                                            <td>{stock.quantity}</td>
                                            <td>${stock.total}</td>
                                            <td>${(stock.total/stock.quantity)}</td>
                                            <td>{(stock.price)}</td>
                                            <td>${(stock.price*stock.quantity-stock.total) }</td>
                                        </tr>
                                    )
                                })}
                            
                        </tbody>
                </Table>
            )
            }

        </div>
    )
}
export default SummaryTable