import React, {useState,useEffect,useContext} from 'react'
import axios from 'axios'
import Chart from './chart'
import { StockContext } from '../context/buyingPowerContext'
const SearchForm = ()=>{
    const [stock, setStock] = useState('')
    const [query, setQuery] = useState('')
    const [data,setData] = useState(null)
    const [timeFrame, setTimeFrame] = useState('1D')

    useEffect (()=>{
        if(stock != ''){
            getStockData()
        }
      }, [stock,timeFrame])



    const updateQuery = (e)=>{
        setQuery(e.target.value)
    }

    const updateStock = (e)=>{
        e.preventDefault()
        setStock(query)
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
            <form class="input-group" onSubmit= {updateStock}>
                <div class="form-outline">
                    <input type="text" class="search-bar" placeholder = "Search for a Stock" onChange={updateQuery}  value = {query}/>
                </div>
                <button id="search-button" type="submit" class="btn btn-primary">
                    <i class="bi bi-search"></i>
                </button>
            </form>
            {data &&
                <div>
                    <select onChange={udpateTimeFrame}>
                        <option selected value = "1D">1D</option>
                        <option value="5D">5D</option>
                        <option value="1M">1M</option>
                        <option value="3M">3M</option>
                        <option value="1Y">1Y</option>
                        <option value= "MAX">MAX</option>
                    </select>
    
                    <Chart stock = {stock} data = {data.data} timeFrame = {timeFrame}/>
                    
                </div>
           
                
            }

        </div>      
    )
}
            
export default SearchForm