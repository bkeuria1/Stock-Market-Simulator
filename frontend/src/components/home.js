import React from 'react'
import { Button,Card } from 'react-bootstrap'
const Home = ()=>{
    return(
        <Card style = {{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh', width: '100%'}}>
            <h1>Welcome to the Stock Market Application!</h1>
            <h2>Please sign in to continue</h2>    
            <Button href = {process.env.REACT_APP_SIGN_IN_URL} variant = "primary">Sign in</Button>
        </Card>
        
    )
}
export default Home