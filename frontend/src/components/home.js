import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button,Card } from 'react-bootstrap'
import Dashboard from './dashboard'
const Home = ()=>{

    let signInURL
    let loggedInURL
    const [loggedIn,setLoggedIn] = useState(false)

    useEffect(()=>{
        console.log("Use Effect being called")
        checkLogin()
    },[loggedIn])

    if(process.env.REACT_APP_MODE === 'dev'){
        signInURL = process.env.REACT_APP_SIGN_IN_URL_DEV
        loggedInURL = process.env.REACT_APP_LOGGEDIN_URL_DEV

        
    }else if(process.env.REACT_APP_MODE === 'prod'){
        signInURL = process.env.REACT_APP_SIGN_IN_URL_PROD
        loggedInURL = process.env.REACT_APP_LOGGEDIN_URL_PROD
    }

    async function checkLogin(){
        console.log(signInURL)
        const result = await axios.get( process.env.REACT_APP_LOGGEDIN_URL,  {withCredentials:true})
        console.log(loggedInURL)
        if(result.data.result){
          setLoggedIn(true)
        }else{
          setLoggedIn(false)
        }
      }
      //
    return(
        <div>
        {loggedIn ?
            <Dashboard></Dashboard>

        :
        <Card style = {{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh', width: '100%'}}>
            <h1>Welcome to the Stock Market Application!</h1>
            <h2>Please sign in to continue</h2>    
            <Button href = {process.env.REACT_APP_SIGN_IN_URL} variant = "primary">Sign in</Button>
        </Card>
        }
        

        </div>
        
    )
}
export default Home