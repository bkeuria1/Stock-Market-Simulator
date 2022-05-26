import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Chart from './chart'
import {Button,Form,Tabs,Tab,Table} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faSearch } from '@fortawesome/free-solid-svg-icons'
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
        const results = await axios.get(`${process.env.REACT_APP_AUTOCOMPLETE_URL}?query=${query}`,{withCredentials:true})
        setSuggestions(results.data)
    }

    return(
        <div style ={{float: 'left',width : "50%", padding: "1rem"}}>
            <Form onSubmit= {updateStock} >
                <Form.Control type="text" placeholder = "Search for a Stock" onChange={(e)=>{setQuery(e.target.value)}}  value = {query}/>
                
                <Button id="search-button" type="submit" variant = "primary">
                    <FontAwesomeIcon icon = {faSearch}></FontAwesomeIcon>
                </Button>
            </Form>
            
            {suggestions.length>0 &&
                
                <div>
                    {show &&
                        <Table bordered hover>
                            <tbody>
                        {suggestions.map(suggestion=>{
                            return (
                                <tr onClick={(e)=>{props.setStock(suggestion.Symbol);setShow(false); setQuery(`${suggestion.Name} ${suggestion.Symbol}`)}}>
                                <td>{suggestion.Name} {suggestion.Symbol}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                        </Table>
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