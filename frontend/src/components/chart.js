import {React,useState,useEffect,useContext} from 'react'
import { Line } from "react-chartjs-2";
import {Chart as ChartJS} from 'chart.js/auto'
import axios from 'axios'
import BuySellForm from './BuySellForm';
import { StockContext } from '../context/stockContext';
const Chart = (props) =>{
    const [closingValues, setClosingValues] = useState({})
    const [dates, setDates] = useState([])
    const [currentPrice,setCurrentPrice] = useState(0)
    const stock = useContext(StockContext)
    useEffect (()=>{
        if(props.data){
            parseData()
            getCurrentPrice()
        }
      }, [props.data])

    const chartData = {
        
        labels: dates,
        datasets: [{
            data: closingValues,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }

    function parseData(){
        let tempValues = []
        let tempDates  = []
        console.log("Here is the data")
        console.log(props.data)
        let data = props.data.attributes
        Object.keys(data).sort().forEach(date=>{
            tempDates.push(date)
            tempValues.push(data[date].close)
        })
       
        setClosingValues(tempValues)
        setDates(tempDates)
    }
    async function getCurrentPrice(){
        const options = {
            method: 'GET',
            url: 'https://alpha.financeapi.net/market/get-realtime-prices',
            params: {symbols: `${stock}`},
            headers: {
                'accept': 'application/json',
                'X-API-KEY': 'BybMqRx5Zt5ZMW0gRC96O11Qpvh3mNEf3MJ5LTK5'
            }
          };
          const res = await axios.request(options)
          console.log(stock)
          console.log(res)
          setCurrentPrice(res.data.data[0].attributes.last)
    }
    const options = {
        responsive: true,
        scales: {
            y: {
                suggestedMin: Math.min(Object.keys(closingValues)),
                suggestedMax: Math.max(Object.keys(closingValues))
            }
        }
    }

    function showClosingValues(){
        for(const i in closingValues){
            console.log(i + closingValues[i])
        }
    }

    return(
        <div>
            <h1>{props.stock}</h1>
            <h3>Current price: {currentPrice}</h3>

            {Object.keys(closingValues).length>0 &&
                <div>
                    <BuySellForm currentPrice = {closingValues.slice(-1)}></BuySellForm>
                    <Line data = {chartData} options = {options}/>
                </div>
            }
        </div>
    )
}
export default Chart