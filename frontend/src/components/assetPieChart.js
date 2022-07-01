import React, {useState,useEffect,useContext} from 'react'
import {Chart as ChartJS} from 'chart.js/auto'
import {Pie} from 'react-chartjs-2';
import { UserStocksContext } from '../context/userStocksContext'
const AssetPieChart = (props) =>{
    const {getUserStocks,userStocks} = useContext(UserStocksContext)
    const [stockQuantity, setStockQuantity] = useState([])
    const [tickers,setTickers] = useState([])
    const [stockTotal, setStockTotal] = useState([])
    const calculatePercentages = ()=>{

    }
    useEffect(()=>{
      let tempStockTickers = props.stockWithPrices.map(stock => stock.ticker)
      let tempStockTotal = props.stockWithPrices.map(stock=> (stock.total + (stock.price*stock.quantity-stock.total)).toFixed(2))
      setTickers(tempStockTickers)
      setStockTotal(tempStockTotal)

    },[JSON.stringify(props.stockWithPrices)])
    const data = {
        labels: tickers,
        datasets: [
          {
            label: 'Portfolio',
            data: stockTotal,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
      
    return(
        <div>
            <Pie
                data={data}
                options={{
                    legend:{
                    display:true,
                    position:'right'
                    }
                }}
        />

        </div>
    )
}

export default AssetPieChart