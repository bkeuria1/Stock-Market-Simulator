import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button,Card } from 'react-bootstrap'
import Dashboard from './dashboard'
const Home = ()=>{

    let signInURL
    const [loggedIn,setLoggedIn] = useState(false)
    useEffect(()=>{
        checkLogin()
    },[loggedIn])
    if(process.env.REACT_APP_MODE === 'dev'){
        signInURL = process.env.REACT_APP_SIGN_IN_URL_DEV
        console.log(signInURL)
    }else if(process.env.REACT_APP_MODE === 'production'){
        signInURL = process.env.REACT_APP_SIGN_IN_URL_PRODUCTION
    }

    async function checkLogin(){
        const result = await axios.get( 'http://localhost:3001/auth/loggedIn',  {withCredentials:true})
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