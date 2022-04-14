import {React,useState,useEffect} from 'react'
import axios from 'axios'
import Chart from './chart'
const Dashboard = (props)=>{
    const [stock, setStock] = useState('')
    const [query, setQuery] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [data,setData] = useState(null)
    const [timeFrame, setTimeFrame] = useState('MAX')
    
    

    useEffect (()=>{
        if(stock != ''){
            getStockData()
        }
      }, [stock,timeFrame])


    
      
    useEffect (()=>{
        checkLogin()
    },[loggedIn])
    
    async function checkLogin(){
      const result = await axios.get( 'http://localhost:3001/auth/loggedIn', {withCredentials:true})
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
        const options = {
            method: 'GET',
            url: 'https://alpha.financeapi.net/symbol/get-chart',
            params: {symbol: `${stock}`, period: `${timeFrame}`},
            headers: {
                'accept': 'application/json',
                'X-API-KEY': 'BybMqRx5Zt5ZMW0gRC96O11Qpvh3mNEf3MJ5LTK5'
            }
          };
        let response
        try{
            response = await axios.request(options)
        }catch(err){
            console.log(err)
        }
        setData(response)

    }
    const udpateTimeFrame = (e)=>{
        e.preventDefault()
        setTimeFrame(e.target.value)
    }

    return (
       
        <div>
            {loggedIn ?
                <div>
                <a href = {process.env.REACT_APP_SIGN_OUT_URL} class = "btn btn-danger">Log Out</a>
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
                                <option value = "1D">1D</option>
                                <option value="5D">5D</option>
                                <option value="1M">1M</option>
                                <option value="3M">3M</option>
                                <option value="1Y">1Y</option>
                                <option selected value= "MAX">MAX</option>
                            </select>
                            <Chart stock = {stock} data = {data.data} timeFrame = {timeFrame}/>
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
