import {React,useState,useEffect,createContext } from 'react'
import axios from 'axios'
import SummaryTable from './summaryTable'
import SearchForm from './searchForm'
import { BuyingPowerContext } from '../context/buyingPowerContext'
import { UserStocksContext } from '../context/userStocksContext'
import {Button,Card,NavBar} from 'react-bootstrap';
const Dashboard = (props)=>{
    const [stock,setStock] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [buyingPower,setBuyingPower] = useState(0)
    const [userStocks,setUserStocks] = useState([])
    useEffect(()=>{
        getBuyingPower()
    },[])

    useEffect(()=>{
        getUserStocks()
        
    },[])
      
    useEffect (()=>{
        checkLogin()
    },[loggedIn])
    
    async function checkLogin(){
        
        const result = await axios.get( process.env.REACT_APP_LOGGEDIN_URL,  {withCredentials:true})
        if(result.data.result){
        setLoggedIn(true)
        }else{
        setLoggedIn(false)
        }
    }
    //updates the query

    const getBuyingPower = async(e)=>{
        const res = await axios.get(process.env.REACT_APP_BUYING_POWER_URL, {withCredentials:true})
        setBuyingPower(res.data.buyingPower)
    }
   
    const reset = async(e)=>{
        axios.get("http://localhost:3001/user/reset",{withCredentials:true})
    }

    const getUserStocks = async()=>{
        const res = await axios.get(process.env.REACT_APP_USERSTOCK_URL,{withCredentials:true})
        setUserStocks(res.data)
    }


    return (
       
        <div>
           {/* // {loggedIn ? */}
                <div style = {{padding: "1.0rem"}}>
                    <Button href = {process.env.REACT_APP_SIGN_OUT_URL} variant = "danger" style = {{float:'right'}}>Log Out</Button> 
                    <BuyingPowerContext.Provider value = {{getBuyingPower, buyingPower}}>
                        <UserStocksContext.Provider value = {{getUserStocks,userStocks}}>
                            <SearchForm stock = {stock} setStock = {setStock}></SearchForm> {/*Contains SearchForm->Chart->BuySellForm */}
                            <SummaryTable stock = {stock} setStock = {setStock}></SummaryTable> {/* Putting the stock up in parent to send to table and SearchForm */}
                        </UserStocksContext.Provider> 
                    </BuyingPowerContext.Provider>   
                </div>
        </div>
    )

 }
 export default Dashboard
