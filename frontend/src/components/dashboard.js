import {React,useState,useEffect,createContext } from 'react'
import axios from 'axios'
import Chart from './chart'
import { StockContext } from '../context/stockContext'
const Dashboard = (props)=>{
    const [stock, setStock] = useState('')
    const [query, setQuery] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [data,setData] = useState(null)
    const [timeFrame, setTimeFrame] = useState('1D')
    const [buyingPower,setBuyingPower] = useState(0)


    useEffect (()=>{
        if(stock != ''){
            getStockData()
        }
      }, [stock,timeFrame])


    useEffect(()=>{
        getBuyingPower()
    },[])
      
    useEffect (()=>{
        checkLogin()
    },[loggedIn])
    
    async function checkLogin(){
      const result = await axios.get( 'http://localhost:3001/auth/loggedIn',  {withCredentials:true})
      if(result.data.result){
        setLoggedIn(true)
        return
      }
      setLoggedIn(false)
    }
    //updates the 
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

    const getBuyingPower = async(e)=>{
        const res = await axios.get('http://localhost:3001/user/buyingPower', {withCredentials:true})
        setBuyingPower(res.data.buyingPower)
    }
    const udpateTimeFrame = (e)=>{
        e.preventDefault()
        setTimeFrame(e.target.value)
    }
    const reset = async(e)=>{
        axios.get("http://localhost:3001/user/reset",{withCredentials:true})
    }

    return (
       
        <div>
            {loggedIn ?
                <div>
                <a href = {process.env.REACT_APP_SIGN_OUT_URL} class = "btn btn-danger">Log Out</a>
                <a href = {process.env.REACT_APP_RESET_PROFILE_URL} class = "btn btn-danger">Reset Profile</a>
                <form class="input-group" onSubmit= {updateStock}>
                    <div class="form-outline">
                        <input type="text" class="search-bar" placeholder = "Search for a Stock" onChange={updateQuery}  value = {query}/>
                    </div>
                    <button id="search-button" type="submit" class="btn btn-primary">
                        <i class="bi bi-search"></i>
                    </button>
                </form>
                    <h2>Buying Power: {buyingPower.toFixed(2)}</h2>
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
                            <StockContext.Provider value={stock}>
                                <Chart stock = {stock} data = {data.data} timeFrame = {timeFrame}/>
                            </StockContext.Provider>
                        </div>
                    }
                </div>
               
                :
                <div>
                <h1>You need to be logged in to access the dashboard</h1>
                <a href = {process.env.REACT_APP_SIGN_IN_URL} class = "btn btn-primary">Sign in</a> 
                </div>
            }

        </div>
    )

 }
 export default Dashboard
