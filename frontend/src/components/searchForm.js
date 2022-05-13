import React, {useState} from 'react'
import axios from 'axios'
import Chart from './chart'
import {Button,Form,Tabs,Tab} from 'react-bootstrap';
import News from './news';
const SearchForm = (props)=>{
    const [query, setQuery] = useState('')
    const stock = props.stock
    const updateStock = (e)=>{
        e.preventDefault()
        props.setStock(query)
    }
    return(
        <div style ={{float: 'left',width : "50%"}}>
            <Form onSubmit= {updateStock} >
                <Form.Control type="text" placeholder = "Search for a Stock" onChange={(e)=>setQuery(e.target.value)}  value = {query}/>
                
                <Button id="search-button" type="submit" variant = "primary">
                    <i class="bi bi-search"></i>
                </Button>
            </Form>
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