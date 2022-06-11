import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Chart from './chart'
import {Button,Form,Tabs,Tab,Table, InputGroup} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCircleXmark, faHome, faSearch} from '@fortawesome/free-solid-svg-icons'
import News from './news';
const SearchForm = (props)=>{
    const [query, setQuery] = useState('')
    const [suggestions,setSuggestions] = useState([])
    const [show,setShow] = useState(false)
    const stock = props.stock

    useEffect(()=>{
        console.log("The query changed")
        if(query.length > 0){
            getSuggestions()
        }else{
            setSuggestions([])
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
            <Form onSubmit= {updateStock}>
                <InputGroup>
                    <InputGroup.Text onClick = {()=>{props.setStock(''); setQuery('')}}>
                        <FontAwesomeIcon icon= {faHome} />
                    </InputGroup.Text>
                    <Form.Control type="text" placeholder = "Search for a Stock" onChange={(e)=>{setQuery(e.target.value)}}  value = {query}></Form.Control>
                    <InputGroup.Text onClick = {()=>setQuery('')}>
                        <FontAwesomeIcon icon= {faCircleXmark} />
                    </InputGroup.Text>
                    <Button id="search-button" type="submit" variant = "primary">
                        <FontAwesomeIcon icon= {faSearch} />
                    </Button>
                </InputGroup>
            </Form>
            {suggestions.length>0 && 
                <div>
                    <Table bordered hover>
                        <tbody>
                            {suggestions.map(suggestion=>{
                                return (
                                    <tr onClick={(e)=>{props.setStock(suggestion.Symbol); setSuggestions([])}}>
                                    <td>{suggestion.Name} {suggestion.Symbol}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    
                </div>
            }
                <div>
                    <Tabs className="mb-3">
                        <Tab eventKey="Chart" title="Chart">
                            <Chart stock = {stock}></Chart>  
                        </Tab>
                        <Tab eventKey="Stock" title= {`${stock} News`}>
                            <News stock = {stock}></News>        
                        </Tab>
                    </Tabs>   
                </div>      
        </div>      
    )
}
            
export default SearchForm