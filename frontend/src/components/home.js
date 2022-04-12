import React from 'react'
const Home = ()=>{
    const login = ()=>{
        console.log(process.env.REACT_APP_SIGN_IN_URL)

    }
    return(
        <div>
            <h1>Welcome the Stock Simulator Application!</h1>
            <h2>Sign in with Google To Continue</h2>
            <a href = {process.env.REACT_APP_SIGN_IN_URL} class = "btn btn-primary">Sign in</a> 
        </div>
        
    )
}
export default Home