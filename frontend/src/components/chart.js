import {React,useState,useEffect} from 'react'
import {Chart as ChartJS} from 'chart.js/auto'
import { Line } from "react-chartjs-2";
import axios from 'axios'
import BuySellForm from './BuySellForm';
import { Button, Form, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faRefresh,faArrowUp, faArrowDown, faStopCircle} from '@fortawesome/free-solid-svg-icons'

const Chart = (props) =>{
    const [closingValues, setClosingValues] = useState([])
    const [dates, setDates] = useState([])
    const [currentPrice,setCurrentPrice] = useState(0)
    const [timeFrame, setTimeFrame] = useState('1D')
    const [data,setData] = useState(null)
    const [companyName,setCompanyName] = useState()
    const [trend, setTrend] = useState({})

    const stock = props.stock

    useEffect(()=>{
        if(stock.length>0){
            getCurrentPrice()
        }else{
            setCompanyName('')
        }
    },[stock])
    
    useEffect(()=>{
        getStockData()
    },[stock,timeFrame])

  
    useEffect (()=>{
        if(data !== null){
            parseData()
        }
        
      }, [JSON.stringify(data)])

    useEffect(()=>{
        if(closingValues[closingValues.length-1] - closingValues[0]>=0){
            setTrend({icon: faArrowUp, color : "green"})
        }else{
            setTrend({icon: faArrowDown, color : "red" })
        }
    },[closingValues])

    const chartData = {
        labels: dates,
        responsive: true,
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
        if(stock.length>0){
            let dataAttributes = data.attributes
            if(dataAttributes){
                Object.keys(dataAttributes).sort().forEach(date=>{      
                    tempDates.push(date)
                    tempValues.push(dataAttributes[date].close)
                })
            }
        }else{
            data.sort().forEach(elm=>{
                tempDates.push(elm.date)
                tempValues.push(elm.balance)
            })
        }  
        setClosingValues(tempValues)
        setDates(tempDates)
    }

    const getCurrentPrice = async()=>{
          const res = await axios.get(`${process.env.REACT_APP_REALTIME_URL}?stock=${stock}`,{withCredentials:true})
          setCurrentPrice(res.data.data[0].attributes.last)
          setCompanyName(res.data.data[0].attributes.name)
    }
    const options = {
        maintainAspectRatio: true,
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
            if(stock.length>0){
                response = await axios.get(`${process.env.REACT_APP_CHART_URL}?stock=${stock}&timeFrame=${timeFrame}`, {withCredentials:true})
                setData(response.data)
            }else{
                response = await axios.get(`${process.env.REACT_APP_BALANCE_URL}`, {withCredentials:true})
                setData(response.data)
            }
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
            {data !== null ?
                <div>

                    <Card style = {{marginLeft:'1.5rem', float:'center', paddingLeft: '1.5rem', paddingRight:'1.5rem',height:'730px'}}>
                        <Button variant = "primary" onClick={getCurrentPrice} style = {{width: "7rem", height: '2.5rem', marginBottom: '1rem', marginTop: '1rem'}}>
                            Refresh <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon>
                        </Button>
                        {stock.length >0 &&
                            <div style = {{width: '40%'}}>
                                <Card.Title>{companyName}</Card.Title>
                                <Card.Text>Ticker: {stock.toUpperCase()}</Card.Text>
                            </div>
                        }
                        <div style = {{position:'relative', marginLeft:'30rem', top:'-5rem'}}>
                            <Card.Title>Current price: {currentPrice}</Card.Title>
                            <Card.Title >
                                <FontAwesomeIcon icon = {trend.icon} color = {trend.color}></FontAwesomeIcon>
                                {(closingValues[closingValues.length-1] - closingValues[0]).toFixed(2)} in the last {timeFrame}
                            </Card.Title>
                        </div>
                        <div style = {{position:'relative', top:'-4rem'}}>
                        <Form.Select onChange={udpateTimeFrame} style = {{width : '6rem', marginTop: '1rem'}}>
                                        <option selected value = "1D">1D</option>
                                        <option value="5D">5D</option>
                                        <option value="1M">1M</option>
                                        <option value="3M">3M</option>
                                        <option value="1Y">1Y</option>
                                        <option value= "MAX">MAX</option>
                                    </Form.Select>  
                            {Object.keys(closingValues).length>0 &&
                                <div >
                                    {stock.length>0 &&
                                        <BuySellForm currentPrice = {currentPrice} stock = {stock}></BuySellForm>
                                    }
                                    <Line  data = {chartData} options = {options}/> 
                            </div>   
                            }
                        </div>
                    </Card>
                </div>
            :
            <div>
                <h1>No Data found - please enter a valid stock</h1>
            </div>

            }
        </div>
    )
}
export default Chart