import {React,useState,useEffect} from 'react'
import {Chart as ChartJS} from 'chart.js/auto'
import { Line } from "react-chartjs-2";
import axios from 'axios'
import BuySellForm from './BuySellForm';
import { Button, Form, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faRefresh } from '@fortawesome/free-solid-svg-icons'
const Chart = (props) =>{
    const [closingValues, setClosingValues] = useState({})
    const [dates, setDates] = useState([])
    const [currentPrice,setCurrentPrice] = useState(0)
    const [timeFrame, setTimeFrame] = useState('1D')
    const [data,setData] = useState(null)
    const [companyName,setCompanyName] = useState('')
    const stock = props.stock
    useEffect(()=>{
        if(stock.length>0){
            getStockData()
        }
    },[stock,timeFrame])

    useEffect(()=>{
        if(stock.length>0){
            getCurrentPrice()
        }
    },[stock])
    
    useEffect (()=>{
        if(stock.length>0){
            parseData()
        }
      }, [JSON.stringify(data)])

    const chartData = {
        labels: dates,
        datasets: [{
            label:"Price",
            data: closingValues,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: .01
        }]
    }

    function parseData(){
        let tempValues = []
        let tempDates  = []
        let dataAttributes = data.attributes
        console.log(dataAttributes)
        if(dataAttributes){
            Object.keys(dataAttributes).sort().forEach(date=>{      
                tempDates.push(date)
                tempValues.push(dataAttributes[date].close)
            })
        
            setClosingValues(tempValues)
            setDates(tempDates)
        }
    }
    const getCurrentPrice = async()=>{
          const res = await axios.get(`http://localhost:3001/stock/realtimePrice?stock=${stock}`,{withCredentials:true})
          setCurrentPrice(res.data.data[0].attributes.last)
          setCompanyName(res.data.data[0].attributes.name)
    }
    const options = {
        responsive: true, 
        maintainAspectRatio: true,
        responsive: true,
        scales: {
            y: {
                suggestedMin: Math.min(Object.keys(closingValues)),
                suggestedMax: Math.max(Object.keys(closingValues))
            }
        }
    }

    async function getStockData(){
        let response
        try{
            response = await axios.get(`http://localhost:3001/stock/chart?stock=${stock}&timeFrame=${timeFrame}`, {withCredentials:true})
            setData(response.data)
        }catch(err){
            console.log(err)
        }
       
    }
    const udpateTimeFrame = (e)=>{
        e.preventDefault()
        setTimeFrame(e.target.value)
    }
    return(
        <div>
            <Card style = {{margin:'1.5rem',padding:"2.5rem", float:'center'}}>
                <h1>{companyName}</h1>
                <h3>{stock}</h3>
                <h3>Current price: {currentPrice}</h3>
            </Card>


            <Button variant = "primary" onClick={getCurrentPrice}>
               Refresh <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon>
            </Button>
            <Form.Select onChange={udpateTimeFrame} >
                        <option selected value = "1D">1D</option>
                        <option value="5D">5D</option>
                        <option value="1M">1M</option>
                        <option value="3M">3M</option>
                        <option value="1Y">1Y</option>
                        <option value= "MAX">MAX</option>
            </Form.Select>
           
            

            {Object.keys(closingValues).length>0 &&
                <div>
                    <BuySellForm currentPrice = {currentPrice} stock = {stock}></BuySellForm>
                    <Line data = {chartData} options = {options}/>
                </div>
            }
        
        </div>
    )
}
export default Chart