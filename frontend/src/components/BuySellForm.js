import React, {useState,useEffect,useContext} from 'react'
import axios from 'axios';
import { StockContext } from '../context/stockContext';
const BuySellForm = (props)=>{
    const [quantity,setQuantity] = useState(0)
    const [currentPrice, setCurrentPrice] = useState(0)
    const [total, setTotal] = useState(0);
    const [show,setShow] = useState(false)
    const [messageContent, setMessageContent] = useState({message:'', class:''})
    const stock = useContext(StockContext)

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
  
      e.preventDefault()
      const savedStock = {
        ticker: stock,
        quantity: parseInt(quantity),
        total: parseInt(total),

      }
      try{
        const res = await axios.post("http://localhost:3001/sale/buy", savedStock,{withCredentials:true})
        console.log("Here is the res"+ res)
     
        let updatedMessage = { message :`Your purchase of ${quantity} ${stock} shares was succesful`,class: 'alert alert-success'}
        setMessageContent(updatedMessage)
        setQuantity(0)
        setTotal(0)
      }catch(err){
        let updatedMessage = { message:"You're purchase was unsuccesful", class:'alert alert-danger'}

        setMessageContent(updatedMessage)
      }
      
      setShow(true)
  
      

    }
    const sellStock = (e)=>{
      e.preventDefault()
    }
    
    const updateQuanity = (e)=>{
      e.preventDefault()
      setQuantity(e.target.value)

    }
    return(
      <div class = "container">
      <ul class="nav nav-tabs">
        <li><a data-toggle="tab" href="#">Buy</a></li>
        <li><a data-toggle="tab" href="#">Sell</a></li>
      </ul>

      <div class="tab-content">
        <div id="menu1" class="tab-pane fade">
          <h3>Menu 1</h3>
          <p>Some content in menu 1.</p>
        </div>
        <div id="menu2" class="tab-pane fade">
          <h3>Menu 2</h3>
          <p>Some content in menu 2.</p>
        </div>
      </div>

      <div>
{/*       
        <form onSubmit={buyStock} >
        <div class="form-group">
              <label for ='buyForm'>Shares</label>
              <input class="form-control"  type='number' id = 'buyForm' onChange = {updateQuanity} value = {quantity} ></input>
              <label>Total Cost:{total}</label>
            <button type = 'submit' class = 'btn btn-primary'>Buy {stock}</button>
        </div>

        </form>
    

    <div class = 'form-group'>
      <form onSubmit={sellStock} class = 'form-group'>
          <label for ='sellForm'>Shares</label>
          <input class="form-control" type='number' id = 'sellFormForm'></input>
          <label for = 'costLabel'>Total Cost: {total}</label>
          <button type = 'submit' class = 'btn btn-danger'>Sell</button>
        </form>
      </div> */}

      {show &&
          <div class = {messageContent.class}>
            {messageContent.message}
          </div>

      }
        
    </div>

    </div>
    
    )
}
export default BuySellForm