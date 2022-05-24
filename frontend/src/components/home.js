import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button,Card } from 'react-bootstrap'
import Dashboard from './dashboard'
const Home = ()=>{

    let signInURL
    let loggedInURL
    const [loggedIn,setLoggedIn] = useState(false)

    useEffect(()=>{
        checkLogin()
    },[loggedIn])
    if(process.env.REACT_APP_MODE === 'dev'){
        signInURL = process.env.REACT_APP_SIGN_IN_URL_DEV
        loggedInURL = process.env.REACT_APP_LOGGEDIN_URL_DEV

        console.log(signInURL)
    }else if(process.env.REACT_APP_MODE === 'prod'){
        signInURL = process.env.REACT_APP_SIGN_IN_URL_PRODUCTION
        loggedInURL = process.env.REACT_APP_LOGGEDIN_URL_PROD
    }

    async function checkLogin(){
        const result = await axios.get( loggedInURL,  {withCredentials:true})
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
            <Button href = {signInURL} variant = "primary">Sign in</Button>
        </Card>
        }
        

        </div>
        
    )
}
export default Home