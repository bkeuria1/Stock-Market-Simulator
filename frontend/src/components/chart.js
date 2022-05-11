import {React,useState,useEffect,useContext} from 'react'
import {Chart as ChartJS} from 'chart.js/auto'
import { Line } from "react-chartjs-2";
import axios from 'axios'
import BuySellForm from './BuySellForm';
import { Form } from 'react-bootstrap';
import News from './news';
const Chart = (props) =>{
    const [closingValues, setClosingValues] = useState({})
    const [dates, setDates] = useState([])
    const [currentPrice,setCurrentPrice] = useState(0)
    const [timeFrame, setTimeFrame] = useState('1D')
    const [data,setData] = useState(null)
    const stock = props.stock
    useEffect(()=>{
        getStockData()
    },[stock,timeFrame])
    useEffect (()=>{
        if(stock.length>0){
            console.log(data)
            parseData()
            getCurrentPrice()
        }
      }, [data])

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
        if(data.length>0){
            console.log("data >0")
            Object.keys(dataAttributes).sort().forEach(date=>{
                tempDates.push(date)
                tempValues.push(data[date].close)
            })
        
            setClosingValues(tempValues)
            setDates(tempDates)
        }
    }
    const getCurrentPrice = async()=>{
          const res = await axios.get(`http://localhost:3001/stock/realtimePrice?stock=${stock}`,{withCredentials:true})
          setCurrentPrice(res.data.data[0].attributes.last)
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
        }catch(err){
            console.log(err)
        }
        setData(response)
    }
    const udpateTimeFrame = (e)=>{
        e.preventDefault()
        setTimeFrame(e.target.value)
    }
    return(
        <div>
            <h1>{stock}</h1>
            <h3>Current price: {currentPrice}</h3>
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