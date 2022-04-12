import {React,useState,useEffect} from 'react'
import axios from 'axios'
import Chart from './chart'
const Dashboard = (props)=>{
    const [stock, setStock] = useState('')
    const [query, setQuery] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [data,setData] = useState(null)
    
      
    useEffect (()=>{
        checkLogin()
    },[loggedIn])
    
    async function checkLogin(){
      const result = await axios.get( 'http://localhost:3001/auth/loggedIn', {withCredentials:true})
      if(result.data.result){
        setLoggedIn(true)
        return
      }
      setLoggedIn(false)
    }
    //updates the 
    const updateQuery = (e)=>{
        setQuery(e.target.value)
    }

    const updateStock = (e)=>{
        e.preventDefault()
        setStock(query)
    }


    return (
       
        <div>
            {loggedIn ?
                <div>
                <a href = {process.env.REACT_APP_SIGN_OUT_URL} class = "btn btn-danger">Log Out</a>
                <form class="input-group" onSubmit= {updateStock}>
                    <div class="form-outline">
                        <input type="text" class="search-bar" placeholder = "Search for a Stock" onChange={updateQuery}  value = {query}/>
                    </div>
                    <button id="search-button" type="submit" class="btn btn-primary">
                        <i class="bi bi-search"></i>
                    </button>
                </form>
                    {stock &&
                        <div>
                            <Chart stock = {stock} />
                        </div>
                    }
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
