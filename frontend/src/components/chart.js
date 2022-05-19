import {React,useState,useEffect} from 'react'
import {Chart as ChartJS} from 'chart.js/auto'
import { Line } from "react-chartjs-2";
import axios from 'axios'
import BuySellForm from './BuySellForm';
import { Button, Form, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faRefresh,faArrowDown, faArrownUp } from '@fortawesome/free-solid-svg-icons'
const Chart = (props) =>{
    const [closingValues, setClosingValues] = useState({})
    const [dates, setDates] = useState([])
    const [currentPrice,setCurrentPrice] = useState(0)
    const [timeFrame, setTimeFrame] = useState('1D')
    const [data,setData] = useState(null)
    const [companyName,setCompanyName] = useState('')
    const [trend, setTrend] = useState({})

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

      useEffect(()=>{
        if(closingValues[closingValues.length-1] - closingValues[0]>=0){
            setTrend({icon: "faArrowUp", color : "green"})
        }else{
            setTrend({icon: "faArrowDown", color : "red"})
        }
        console.log("The trend is" + trend.icon)
        console.log("The trend color is" + trend.color)

      },[closingValues])

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
            
            <Button variant = "primary" onClick={getCurrentPrice}>
               Refresh <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon>
            </Button>
            <Card style = {{margin:'1.5rem',padding:"2.5rem", float:'center'}}>
                <Card.Title>{companyName}</Card.Title>
                <Card.Text>Ticker: {stock.toUpperCase()}</Card.Text>
                <Card.Title>Current price: {currentPrice}</Card.Title>
                <Card.Title>
                    <FontAwesomeIcon icon={trend.icon} style = {{color: trend.color}}/>
                    {closingValues[closingValues.lenght-1] - closingValues[0]} in the last {timeFrame}
                </Card.Title>
            </Card>
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