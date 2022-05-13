import {React,useState,useEffect,createContext } from 'react'
import axios from 'axios'
import SummaryTable from './summaryTable'
import SearchForm from './searchForm'
import { BuyingPowerContext } from '../context/buyingPowerContext'
import { UserStocksContext } from '../context/userStocksContext'
import {Button,Card} from 'react-bootstrap';
const Dashboard = (props)=>{
    const [stock,setStock] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [buyingPower,setBuyingPower] = useState(0)
    const [userStocks,setUserStocks] = useState([])
    //const buyingPowerContext = [buyingPower,setBuyingPower]
    // const userStocksContext = [userStocks,setUserStocks]
    useEffect(()=>{
        getBuyingPower()
    },[])

    useEffect(()=>{
        console.log("User stocks called")
        getUserStocks()
    },[])
      
    useEffect (()=>{
        checkLogin()
    },[loggedIn])
    
    async function checkLogin(){
      const result = await axios.get( 'http://localhost:3001/auth/loggedIn',  {withCredentials:true})
      if(result.data.result){
        setLoggedIn(true)
      }else{
        setLoggedIn(false)
      }
    }
    //updates the query

    const getBuyingPower = async(e)=>{
        const res = await axios.get('http://localhost:3001/user/buyingPower', {withCredentials:true})
        setBuyingPower(res.data.buyingPower)
    }
   
    const reset = async(e)=>{
        axios.get("http://localhost:3001/user/reset",{withCredentials:true})
    }

    const getUserStocks = async()=>{
        const res = await axios.get('http://localhost:3001/stock/userStocks',{withCredentials:true})
        setUserStocks(res.data)
    }


    return (
       
        <div>
            {loggedIn ?
                <div>
                    <Button href= {process.env.REACT_APP_SIGN_OUT_URL} variant = "danger" style = {{float:'right'}}>Log Out</Button> 
                    <BuyingPowerContext.Provider value = {{getBuyingPower, buyingPower}}>
                        <UserStocksContext.Provider value = {{getUserStocks,userStocks}}>
                            <SearchForm stock = {stock} setStock = {setStock}></SearchForm> {/*Contains SearchForm->Chart->BuySellForm */}
                            <SummaryTable stock = {stock} setStock = {setStock}></SummaryTable> {/* Putting the stock up in parent to send to table and SearchForm */}
                        </UserStocksContext.Provider> 
                    </BuyingPowerContext.Provider>   
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
