import React, {useState,useEffect,useContext} from 'react'
import axios from 'axios';
import { StockContext } from '../context/stockContext';
const BuySellForm = ()=>{
    const [quantity,setQuantity] = useState(0)
    const [currentPrice, setCurrentPrice] = useState(0)
    const [total, setTotal] = useState(0);
    const stock = useContext(StockContext)

    
    const buyStock = async (e)=>{
  
      e.preventDefault()
      const savedStock = {
        ticker: stock,
        total: total
      }
      await axios.post("http://localhost:3001/stocks/buy", {},{withCredentials:true})
      

    }
    const sellStock = (e)=>{
      e.preventDefault()
    }
    
    const updateQuanity = (e)=>{
      e.preventDefault()
      setQuantity(e.target.value)
    }
    return(
       <div>
        
          <form onSubmit={buyStock} >
          <div class="form-group">
                <label for ='buyForm'>Shares</label>
                <input class="form-control"  type='number' id = 'buyForm' onChange = {updateQuanity} value = {quantity} ></input>
                <label>Total Cost:{total}</label>
          
                <button type = 'submit' class = 'btn btn-primary'>Buy {stock}</button>
          </div>
          </form>
          
      
       
      {/* <div class = 'form-group'>
        <form onSubmit={sellStock} class = 'form-group'>
            <label for ='sellForm'>Shares</label>
            <input type='number' id = 'sellFormForm'></input>
            <label for = 'costLabel'>Total Cost: {getTotal}</label>
            <button type = 'submit' class = 'btn btn-danger'>Sell</button>
          </form>
        </div> */}
          
      </div>
    
    )
}
export default BuySellForm