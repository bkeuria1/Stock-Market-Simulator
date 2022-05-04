import React, {useState,useEffect,useContext} from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UserStocksContext } from '../context/userStocksContext'
import {  faRefresh } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
const SummaryTable = (props)=>{
    //const [userStocks,setUserStocks] = useState([])
    const [currentPrices,setCurrentPrices] = useState([])
    const [stockWithPrices, setStockWithPrices] = useState([])
    const [total,setTotal] = useState(0)
    const {getUserStock,userStocks} = useContext(UserStocksContext)

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
        console.log("get current prices called")
        let queryString = ''
        if(userStocks.length>0){
            userStocks.forEach(stock=>{
                queryString+=`${stock.ticker}%2c`
            })
           
            //const res = await axios.get(`http://localhost:3001/stock/realtimePrice?stock=${queryString}`,{withCredentials:true})
            // console.log(res.data)
             let tempPrices = []
            for(let i =0;i<10;i++){
                tempPrices.push(Math.random()*10)
            }
            // res.data.data.forEach(stock=>{
            //     console.log(stock.attributes.last)
            //     tempPrices.push(stock.attributes.last)
            // })
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
                        <tfoot>
                            <td>Total</td>
                            <td>{total}</td>
                        </tfoot>
                </Table>
            )
            }

        </div>
    )
}
export default SummaryTable