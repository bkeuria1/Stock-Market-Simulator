import React, {useState,useEffect,useContext} from 'react'
import axios from 'axios';
import { StockContext } from '../context/stockContext';
const BuySellForm = (props)=>{
    const [quantity,setQuantity] = useState(0)
    const [total, setTotal] = useState(0);
    const [sell, setSell] = useState(false)
    const [show,setShow] = useState(false)
    const [messageContent, setMessageContent] = useState({message:'', class:''})
    const stock = useContext(StockContext)
    useEffect(()=>{
      ownsStock()
      setSell(false)
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
          setSell(true)
        }else if(e.target.id === 'sell'){
          res = await axios.patch("http://localhost:3001/sale/sell", targetStock,{withCredentials:true})
          updatedMessage = { message :`Your sale of ${quantity} ${stock} shares was succesful`,class: 'alert alert-success'}
        }
        setQuantity(0)
        setTotal(0)
      }catch(err){
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
      const res = await axios.get("http://localhost:3001/stock/userStocks",{withCredentials:true})
      console.log(res.data)
      res.data.forEach(ownedStock => {
        console.log(stock.ticker, stock)

        if(ownedStock.ticker === stock){
          console.log("found")
          setSell(true)
        }
      });
    }
    return(
      

      <div>
      
        <form>
        <div class="form-group">
              <label for ='buyForm'>Shares</label>
              <input class="form-control"  type='number' id = 'buyForm' onChange = {updateQuanity} value = {quantity} ></input>
              <label>Total Cost:{total}</label>
          <button id = 'buy' onClick = {buyStock} class = 'btn btn-primary'>Buy {stock}</button>
          {sell &&
            <button id = 'sell' onClick = {buyStock} class = 'btn btn-danger'>Sell {stock}</button>
          }
        </div>
        </form>

      {show &&
          <div class = {messageContent.class}>
            {messageContent.message}
          </div>

      }
        
    </div>

    
    )
}
export default BuySellForm