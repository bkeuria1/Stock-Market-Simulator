import React, {useState,useEffect,useContext} from 'react'
import axios from 'axios';
import { BuyingPowerContext } from '../context/buyingPowerContext';
import { UserStocksContext } from '../context/userStocksContext';
import {Button,Form,Tab,Tabs} from 'react-bootstrap';
const BuySellForm = (props)=>{
    const [quantity,setQuantity] = useState(0)
    const [total, setTotal] = useState(0);
    const [sell, setSell] = useState(false)
    const [show,setShow] = useState(false)
    const [messageContent, setMessageContent] = useState({message:'', class:''})
    const stock = props.stock
    const {getBuyingPower, buyingPower} = useContext(BuyingPowerContext)
    //const [buyingPower,setBuyingPower] = useContext(BuyingPowerContext)
    const {getUserStocks, userStocks} = useContext(UserStocksContext)
    useEffect(()=>{
      setSell(false)
      ownsStock()
    },[stock])

    useEffect(()=>{
      setTotal(quantity*props.currentPrice)
    },[quantity])

    useEffect(()=>{
      const timeId = setTimeout(() => {
        // After 3 seconds set the show value to false
        setShow(false)
      }, 3000)

      return () => {
        clearTimeout(timeId)
      }
    },[show])

    const buyStock = async (e)=>{
      console.log(e.target.id)
      e.preventDefault()
      const targetStock = {
        ticker: stock,
        quantity: parseInt(quantity),
        total: parseInt(total),

      }
      let res
      let updatedMessage
      if(quantity<=0){
        updatedMessage = { message :`Invalid Number: Please Enter a number greater than 0`,class: 'alert alert-danger'}
      }
      try{
        if(quantity<=0){
          updatedMessage = { message :`Invalid Number: Please Enter a number greater than 0`,class: 'alert alert-danger'}
        }
      
        else if(e.target.id === 'buy'){
        res = await axios.post("http://localhost:3001/sale/buy", targetStock,{withCredentials:true})
        updatedMessage = { message :`Your purchase of ${quantity} ${stock} shares was succesful`,class: 'alert alert-success'}
        await axios.post("http://localhost:3001/mail/sale",updatedMessage,{withCredentials:true})
        setSell(true)
        //setBuyingPower(buyingPower - total)
        
      }else if(e.target.id === 'sell'){
        res = await axios.patch("http://localhost:3001/sale/sell", targetStock,{withCredentials:true})
        updatedMessage = { message :`Your sale of ${quantity} ${stock} shares was succesful`,class: 'alert alert-success'}
  

        //setBuyingPower(buyingPower + total)
      }
        setQuantity(0)
        setTotal(0)
        getUserStocks()
        getBuyingPower()
        //sendEmail(updatedMessage)
      }catch(err){
        console.log(err)
        updatedMessage = { message:"You're transaction was unsuccesful", class:'alert alert-danger'}
      }
      
      setMessageContent(updatedMessage)
      setShow(true)
    }

    const updateQuanity = (e)=>{
      e.preventDefault()
      setQuantity(e.target.value)

    }

    const ownsStock = async()=>{
      const ownedStock = await axios.get("http://localhost:3001/stock/userStocks",{withCredentials:true})
      const found = ownedStock.data.some(el => el.ticker === stock)
      if(found)setSell(true)
    }

    const sendEmail = async(message)=>{
      try{
        await axios.post("http://localhost:3001/mail/sale",message,{withCredentials:true})
      }catch(err){
        console.log(err)
      }
    }

    return(
      <div>
        <Form>
          <Form.Group>
                <Form.Label for ='buyForm'>Shares</Form.Label>
                <Form.Control  type='number' id = 'buyForm' onChange = {updateQuanity} value = {quantity} ></Form.Control>
                <Form.Label>Total Cost:{total}</Form.Label>
            <Button id = 'buy' onClick = {buyStock} class = 'primary'>Buy {stock}</Button>
            {sell &&
              <Button id = 'sell' onClick = {buyStock} variant = 'danger'>Sell {stock}</Button>
            }
          </Form.Group>
        </Form>
      {show &&
          <div class = {messageContent.class}>
            {messageContent.message}
          </div>

      } 
    </div>
    )
}
export default BuySellForm