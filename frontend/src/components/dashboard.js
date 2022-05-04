import {React,useState,useEffect,createContext } from 'react'
import axios from 'axios'
import SummaryTable from './summaryTable'
import SearchForm from './searchForm'
import { BuyingPowerContext } from '../context/buyingPowerContext'
import { UserStocksContext } from '../context/userStocksContext'
import Button from 'react-bootstrap/Button';
const Dashboard = (props)=>{
    const [loggedIn, setLoggedIn] = useState(false)
    const [buyingPower,setBuyingPower] = useState(0)
    const [userStocks,setUserStocks] = useState([])
    const buyingPowerContext = [buyingPower,setBuyingPower]
    // const userStocksContext = [userStocks,setUserStocks]
    useEffect(()=>{
        getBuyingPower()
    },[buyingPower])

    useEffect(()=>{
        getUserStocks()
    },[JSON.stringify(userStocks)])
      
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
        console.log("Get User stocks called")
        const res = await axios.get('http://localhost:3001/stock/userStocks',{withCredentials:true})
        setUserStocks(res.data)
    }


    return (
       
        <div>
            {loggedIn ?
                <div>
                    <Button href= {process.env.REACT_APP_RESET_PROFILE_URL} variant = "danger" >Log Out</Button>
                    <a href = {process.env.REACT_APP_RESET_PROFILE_URL} class = "btn btn-danger">Reset Profile</a>

                    <h2>Buying Power: {buyingPower.toFixed(2)}</h2>
                    <BuyingPowerContext.Provider value = {buyingPowerContext}>
                        <UserStocksContext.Provider value = {{getUserStocks,userStocks}}>
                            <SearchForm ></SearchForm> {/*Contains SearchForm->Chart->BuySellForm */}
                            <SummaryTable></SummaryTable>
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
