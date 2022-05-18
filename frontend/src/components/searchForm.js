import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Chart from './chart'
import {Button,Form,Tabs,Tab} from 'react-bootstrap';
import News from './news';
const SearchForm = (props)=>{
    const [query, setQuery] = useState('')
    const [suggestions,setSuggestions] = useState([])
    const [show,setShow] = useState(false)
    const stock = props.stock
    useEffect(()=>{
        if(query.length > 0){
            setShow(true)
            getSuggestions()
        }else{
            setSuggestions([])
            setShow(false)
        }
    },[query])
    const updateStock = (e)=>{
        e.preventDefault()
        setShow(false)
        props.setStock(query)
    }
    const getSuggestions = async()=>{
        const results = await axios.get(`http://localhost:3001/stock/autocomplete?query=${query}`,{withCredentials:true})
        setSuggestions(results.data)
    }
    return(
        <div style ={{float: 'left',width : "50%"}}>
            <Form onSubmit= {updateStock} >
                <Form.Control type="text" placeholder = "Search for a Stock" onChange={(e)=>{setQuery(e.target.value)}}  value = {query}/>
                
                <Button id="search-button" type="submit" variant = "primary">
                    <i class="bi bi-search"></i>
                </Button>
            </Form>
            
            {suggestions.length>0 &&
                
                <div>
                    {show &&
                        <div>
                        {suggestions.map(suggestion=>{
                            return (
                                <li onClick = {()=>props.setStock(suggestion.Symbol)}>{suggestion.Name} {suggestion.Symbol}</li>
                            )
                        })}
                        </div>
                    }
                </div>

            }
                <div>
                    <Tabs className="mb-3">
                    <Tab eventKey="Stock" title= {`${stock} News`}>
                        <News stock = {stock}></News>        
                        </Tab>
                        <Tab eventKey="Chart" title="Chart">
        
                            <Chart stock = {stock}></Chart>
                            
                        </Tab>
                    </Tabs>   
                </div>   
            
        </div>      
    )
}
            
export default SearchForm