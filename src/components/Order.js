import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeBuyOrder, makeSellOrder } from '../store/interaction';
const Order = () => {

  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [isBuy, setIsBuy] = useState(true);
  
  const dispatch = useDispatch()
  // const chainId = useSelector(state => state.provider.chainId)
  // const account = useSelector(state => state.provider.account)
  const exchange = useSelector(state => state.exchange.contract)
  // const selectedSymbols = useSelector(state => state.selectedTokens.symbols)
  const selectedTokens = useSelector(state => state.selectedTokens.contracts)
  const provider = useSelector(state => state.provider.connection)

  const buyRef = useRef(null)
  const sellRef = useRef(null)  
  const tabHandler = (e) => {
    console.log(e.target.className)
    if (e.target.className !== buyRef.current.className) {
      e.target.className = 'tab tab--active'
      buyRef.current.className = 'tab'
      setIsBuy(false)
    } else {
      e.target.className = 'tab tab--active'
      sellRef.current.className = 'tab'
      setIsBuy(true)
    }
    // e.target
  }

  const buyHandler= (e)=>{
    e.preventDefault()
    console.log("buy")
    let order={amount,price}
    makeBuyOrder(provider, exchange, selectedTokens, order, dispatch)
    clearValues()
  }
 
  const sellHandler= (e)=>{
    e.preventDefault()
    console.log("sell")
    let order={amount,price}
    makeSellOrder(provider, exchange, selectedTokens, order, dispatch)
    clearValues()
  }
  const clearValues=() =>{
    setAmount(0)
    setPrice(0)
  }
  return (


    <div className="component exchange__orders">
      <div className='component__header flex-between'>
        <h2>New Order</h2>
        <div className='tabs'>
          <button ref={buyRef} className='tab tab--active' onClick={tabHandler}>Buy</button>
          <button ref={sellRef} className='tab' onClick={tabHandler}>Sell</button>
       
        </div>
      </div>

      <form onSubmit={isBuy?(e) => buyHandler(e):(e) => sellHandler(e)}>
        {isBuy?(
            <label htmlFor="amount">Buy Amount</label>
        ):(
            <label htmlFor="amount">Sell Amount</label>
        )}
        <input type="text" id='amount' placeholder='0.0000' 
        onChange={(e)=>setAmount(e.target.value)} 
        value={amount===0?'':amount} 
        />
        {isBuy?(
            <label htmlFor="price">Buy Price</label>
        ):(
            <label htmlFor="price">Sell Price</label>
        )}
        <input type="text" id='price' placeholder='0.0000'  
          onChange={(e)=>setPrice(e.target.value)}
          value={price===0?'':price}
        />

        <button className='button button--filled' type='submit' >
        {isBuy ?
              (<span>Buy</span>) :
              (<span>Sell</span>)
            }
        </button>
      </form>
    </div>
  );
}

export default Order;