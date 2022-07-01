import React, {useState,useEffect,useContext} from 'react'
import axios from 'axios'
import './table.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UserStocksContext } from '../context/userStocksContext'
import {  faRefresh } from '@fortawesome/free-solid-svg-icons'
import {Button,Table,Card,Tabs,Tab} from 'react-bootstrap';
import { BuyingPowerContext } from '../context/buyingPowerContext'
import AssetPieChart from './assetPieChart'
const SummaryTable = (props)=>{
    const [currentPrices,setCurrentPrices] = useState([])
    const [stockWithPrices, setStockWithPrices] = useState([])
    const [totalGains,setTotalGains] = useState(0)
    const [totalAssets,setTotalAssets] = useState(0)
    const {getUserStocks,userStocks} = useContext(UserStocksContext)
    const {getBuyingPower, buyingPower} = useContext(BuyingPowerContext)
    const SECOND = 1000
    const MINUTES = SECOND * 60


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

    const getCurrentPrices = async()=>{
        let queryString = ''
        if(userStocks.length>0){
            userStocks.forEach(stock=>{
                queryString+=`${stock.ticker}%2c`
            })
           
            
            const res = await axios.get(`${process.env.REACT_APP_REALTIME_URL}?stock=${queryString}`,{withCredentials:true})
            let tempPrices = []
            // for( let i = 0; i<20; i++){
            //     tempPrices.push(Math.random())
            // }
            res.data.data.forEach(stock=>{
               
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

    const getTotals = ()=>{
        let tempTotalGains = 0
        let tempTotalAssets = 0
        stockWithPrices.forEach(stock=>{
            tempTotalAssets += (stock.total + (stock.price*stock.quantity-stock.total))
            tempTotalGains += stock.price*stock.quantity-stock.total
        })
        setTotalGains(tempTotalGains)
        setTotalAssets(tempTotalAssets)
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
                    Total Balance: {(totalAssets+buyingPower).toFixed(2)}
                </Card.Text>
            </Card.Body>
            </Card>
          
            {stockWithPrices.length>0 && (
                <div>
                <Tabs className="mb-3">
                    <Tab eventKey="Table" title="Table">
                    <div style = {{marginTop: '2rem', overflowY: 'scroll', height: "20rem"}}> 
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
                                                <td>{stock.ticker.toUpperCase()}</td>
                                                <td>{stock.quantity}</td>
                                                <td>${(stock.total + (stock.price*stock.quantity-stock.total)).toFixed(2)}</td>
                                                <td>${(stock.total/stock.quantity).toFixed(2)}</td>
                                                <td>{stock.price}</td>
                                                <td style ={{color: stock.price*stock.quantity-stock.total>0 ? 'green' : 'red'}}>${(stock.price*stock.quantity-stock.total).toFixed(2)}</td>
                                            </tr>
                                        )
                                    })}
                                
                            </tbody>
                    </Table>
                </div>
                       
                    </Tab>
                    <Tab eventKey="Chart" title = "Chart" >
                        <AssetPieChart style={{height :'1rem'}} totalAssets = {totalAssets} stockWithPrices = {stockWithPrices}/>
                    </Tab>
                </Tabs>   
            

                </div>
            )
           
            }
            

        </div>
    )
}
export default SummaryTable