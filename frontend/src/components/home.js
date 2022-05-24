import React from 'react'
import { Button,Card } from 'react-bootstrap'
const Home = ()=>{
    let signInURL
    if(process.env.REACT_APP_MODE === 'dev'){
        signInURL = process.env.REACT_APP_SIGN_IN_URL_DEV
    }else if(process.env.REACT_APP_MODE === 'production'){
        signInURL = process.env.REACT_APP_SIGN_IN_URL_PRODUCTION
    }
    return(
        <Card style = {{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh', width: '100%'}}>
            <h1>Welcome to the Stock Market Application!</h1>
            <h2>Please sign in to continue</h2>    
            <Button href = {signInUrl} variant = "primary">Sign in</Button>
        </Card>
        
    )
}
export default Home