import {React,useState,useEffect} from 'react'
import { Line } from "react-chartjs-2";
import {Chart as ChartJS} from 'chart.js/auto'
import axios from 'axios'
const Chart = (props) =>{
    const [closingValues, setClosingValues] = useState([])
    const [timeFrame, setTimeFrame] = useState('1Y')
    const [data,setData] = useState(null)
    const [cache,setCache] = useState([])

    useEffect(()=>{
        //
    },[timeFrame])

    useEffect (()=>{
        if(props.stock != ''){
            getStockData().then(parseData)
        }
      }, [props.stock,timeFrame])

    async function getStockData(){
        const options = {
            method: 'GET',
            url: 'https://alpha.financeapi.net/symbol/get-chart',
            params: {symbol: `${props.stock}`, period: `${timeFrame}`},
            headers: {
                'accept': 'application/json',
                'X-API-KEY': 'BybMqRx5Zt5ZMW0gRC96O11Qpvh3mNEf3MJ5LTK5'
            }
          };
        let response
        try{
            response = await axios.request(options)
            setData(response)
        }catch(err){
            console.log(err)
        }

    }

    
    const chartData = {
        labels: [...Array(closingValues.length).keys()],
        datasets: [{
            data: closingValues,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }
    const options = {
        responsive: true,
        scales: {
            y: {
                suggestedMin: Math.min(...closingValues),
                suggestedMax: Math.max(...closingValues)
            }
        }
    }

    function parseData(){
        console.log(data.data)
        Object.entries(data.data.attributes).forEach((date)=>{
            setClosingValues(closingValues=>([...closingValues,date[1].close]))
        })
    }
    const udpateTimeFrame = (e)=>{
        e.preventDefault()
        setTimeFrame(e.target.value)
    }
    return(
        <div>
            <h1>{props.stock}</h1>
            {closingValues.length>0 &&
                <div>
                    <select onChange={udpateTimeFrame}>
                        <option selected value = "1D">1D</option>
                        <option value="1W">1W</option>
                        <option value="1M">1M</option>
                        <option value="3M">3M</option>
                        <option value="1Y">1Y</option>
                        <option value= "MAX">MAX</option>
                    </select>
                    <Line data = {chartData} options = {options}/>
                </div>
            }
        </div>
    )
}
export default Chart