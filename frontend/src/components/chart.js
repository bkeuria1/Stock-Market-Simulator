import {React,useState,useEffect} from 'react'
import { Line } from "react-chartjs-2";
import {Chart as ChartJS} from 'chart.js/auto'
import axios from 'axios'
const Chart = (props) =>{
    const [closingValues, setClosingValues] = useState([])


    useEffect (()=>{
        setClosingValues([])
        if(props.data){
            parseData()
        }
      }, [props.data])

    const chartData = {
        labels: [...Array(closingValues.length).keys()],
        datasets: [{
            data: closingValues,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }

    function parseData(){
        console.log("Here is the data")
        console.log(props.data)
        let data = props.data

        Object.entries(props.data.attributes).sort().forEach((date)=>{
            setClosingValues(closingValues=>([...closingValues,date[1].close]))

        })
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

    function showClosingValues(){
        closingValues.forEach(i=>console.log(i))
    }

    return(
        <div>
            <h1>{props.stock}</h1>
            {closingValues.length>0 &&
                <div>
                    <button onClick={showClosingValues} ></button>
                    <Line data = {chartData} options = {options}/>
                </div>
            }
        </div>
    )
}
export default Chart