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
    const [signOutUrl, setSignOutUrl] = useState('')
    //const buyingPowerContext = [buyingPower,setBuyingPower]
    // const userStocksContext = [userStocks,setUserStocks]
    let loggedInURL
    let userStocksURL
    let buyingPowerURL
    let logoutURL
    let signInURL

    useEffect(()=>{
        console.log("HEY THERE DAWG")
        if(process.env.REACT_APP_MODE === 'dev'){
            console.log("IN Dev mode")
            loggedInURL = process.env.REACT_APP_LOGGEDIN_URL_DEV
            userStocksURL = process.env.REACT_APP_USERSTOCK_URL_DEV
            buyingPowerURL = process.env.REACT_APP_BUYING_POWER_URL_DEV
            setSignOutUrl(process.env.REACT_APP_SIGN_OUT_URL_DEV)
            signInURL = process.env.REACT_APP_SIGN_IN_URL_DEV
    
        } else if(process.env.REACT_APP_MODE === 'prod'){
            console.log("in prod mode")
            loggedInURL = process.env.REACT_APP_LOGGEDIN_URL_PROD
            userStocksURL = process.env.REACT_APP_USERSTOCK_URL_PROD
            buyingPowerURL = process.env.REACT_APP_BUYING_POWER_URL_PROD
            setSignOutUrl(process.env.REACT_APP_SIGN_OUT_URL_PROD)
            signInURL = process.env.REACT_APP_SIGN_IN_URL_PROD
            
    
        }
        console.log(logoutURL+" is the logout url")

    },[])


    useEffect(()=>{
        getBuyingPower()
    },[])

    useEffect(()=>{
        getUserStocks()
        
    },[])
      
    useEffect (()=>{
        console.log("use effect in dashboard called")
    
        checkLogin()
    },[loggedIn])
    
    async function checkLogin(){
        console.log(loggedInURL)
        
        const result = await axios.get( loggedInURL,  {withCredentials:true})
        if(result.data.result){
        setLoggedIn(true)
        }else{
        setLoggedIn(false)
        }
    }
    //updates the query

    const getBuyingPower = async(e)=>{
        const res = await axios.get(buyingPowerURL, {withCredentials:true})
        setBuyingPower(res.data.buyingPower)
    }
   
    const reset = async(e)=>{
        axios.get("http://localhost:3001/user/reset",{withCredentials:true})
    }

    const getUserStocks = async()=>{
        const res = await axios.get(userStocksURL,{withCredentials:true})
        console.log("User stocks called")
        setUserStocks(res.data)
    }


    return (
       
        <div>
           {/* // {loggedIn ? */}
                <div style = {{padding: "1.0rem"}}>
                    <Button href = {signOutUrl} variant = "danger" style = {{float:'right'}}>Log Out</Button> 
                    <BuyingPowerContext.Provider value = {{getBuyingPower, buyingPower}}>
                        <UserStocksContext.Provider value = {{getUserStocks,userStocks}}>
                            <SearchForm stock = {stock} setStock = {setStock}></SearchForm> {/*Contains SearchForm->Chart->BuySellForm */}
                            <SummaryTable stock = {stock} setStock = {setStock}></SummaryTable> {/* Putting the stock up in parent to send to table and SearchForm */}
                        </UserStocksContext.Provider> 
                    </BuyingPowerContext.Provider>   
                </div>
                {/* :
                <div>
                <h1>You need to be logged in to access the dashboard</h1>
                <a href = {signInURL} class = "btn btn-primary">Sign in</a> 
                </div> */}
            {/* //} */}
       

        </div>
    )

 }
 export default Dashboard
