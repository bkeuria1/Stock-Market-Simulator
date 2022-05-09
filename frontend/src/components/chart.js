import {React,useState,useEffect,useContext} from 'react'
import {Chart as ChartJS} from 'chart.js/auto'
import { Line } from "react-chartjs-2";
import axios from 'axios'
import BuySellForm from './BuySellForm';
import News from './news';
const Chart = (props) =>{
    const [closingValues, setClosingValues] = useState({})
    const [dates, setDates] = useState([])
    const [currentPrice,setCurrentPrice] = useState(0)
    const stock = props.stock
    useEffect (()=>{
        if(props.data){
            parseData()
            getCurrentPrice()
        }
      }, [props.data])

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
        let data = props.data.attributes
        Object.keys(data).sort().forEach(date=>{
            tempDates.push(date)
            tempValues.push(data[date].close)
        })
       
        setClosingValues(tempValues)
        setDates(tempDates)
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
    return(
        <div>
            <h1>{stock}</h1>
            <h3>Current price: {currentPrice}</h3>

            {Object.keys(closingValues).length>0 &&
                <div>
                    <BuySellForm currentPrice = {currentPrice} stock = {stock}></BuySellForm>
                    <Line data = {chartData} options = {options}/>
                    <News stock = {stock}></News>
                </div>
            }
        </div>
    )
}
export default Chart