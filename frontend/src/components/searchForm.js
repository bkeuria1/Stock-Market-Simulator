import React, {useState,useEffect,useContext} from 'react'
import axios from 'axios'
import Chart from './chart'
import { StockContext } from '../context/buyingPowerContext'
import {Button,Form,Tabs,Tab} from 'react-bootstrap';
import News from './news';
const SearchForm = (props)=>{
    const [stock, setStock] = useState('')
    const [query, setQuery] = useState('')
    const [data,setData] = useState(null)
    //const [timeFrame, setTimeFrame] = useState('1D')
    //const stock = props.stock
    // console.log(stock)
    // useEffect (()=>{
    //     if(stock != ''){
    //         getStockData()
    //     }
    //   }, [stock,timeFrame])



    const updateQuery = (e)=>{
        setQuery(e.target.value)
    }

    const updateStock = (e)=>{
        e.preventDefault()
        props.setStock(query)
    }

    // async function getStockData(){
    //     let response
    //     try{
    //         response = await axios.get(`http://localhost:3001/stock/chart?stock=${stock}&timeFrame=${timeFrame}`, {withCredentials:true})
    //     }catch(err){
    //         console.log(err)
    //     }
    //     setData(response)
    // }

    // const udpateTimeFrame = (e)=>{
    //     e.preventDefault()
    //     setTimeFrame(e.target.value)
    // }
    return(
        <div style ={{float: 'left',width : "50%"}}>
            <Form onSubmit= {updateStock} >
                
                <Form.Control type="text" placeholder = "Search for a Stock" onChange={updateQuery}  value = {query}/>
                
                <Button id="search-button" type="submit" variant = "primary">
                    <i class="bi bi-search"></i>
                </Button>
            </Form>
    
                <div>
                    <Tabs className="mb-3">
                        <Tab eventKey="Chart" title="Chart">
                            <Chart stock = {stock}/>
                        </Tab>
                        <Tab eventKey="Stock" title= {`${stock} News`}>
                            <News stock = {stock}></News>
                        </Tab>
                    </Tabs>   
                </div>   
            
        </div>      
    )
}
            
export default SearchForm