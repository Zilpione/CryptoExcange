
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../assets/ZilpioGmaingLogoTransparent.png';
import eth from '../assets/eth.svg';
import { loadBalances, transferToken } from '../store/interaction';
const Balance = () => {
  const [depositAmount, setDepositAmount] = useState(false);
  const [deposit2Amount, setDeposit2Amount] = useState(false);
  const dispatch = useDispatch()
  const chainId = useSelector(state => state.provider.chainId)
  const account = useSelector(state => state.provider.account)
  const exchange = useSelector(state => state.exchange.contract)
  const selectedSymbols = useSelector(state => state.selectedTokens.symbols)
  const selectedTokens = useSelector(state => state.selectedTokens.contracts)
  const provider = useSelector(state => state.provider.connection)

  const tokenBalances = useSelector(state => state.selectedTokens.balances)
  const exchangeBalances = useSelector(state => state.exchange.balances)
  const transferInProgress = useSelector(state => state.exchange.transferInProgress)
  // console.log(tokenBalances)

  const amountHandler = (e, token) => {
    if (token.target === selectedTokens[0].target) {
      setDepositAmount(e.target.value)
      // console.log(depositAmount)
    } else
      if (token.target === selectedTokens[1].target) {
        setDeposit2Amount(e.target.value)
        // console.log(withdrawAmount)
      }

  }
  const depositHandler = (e, token) => {
    e.preventDefault()
    console.log(token)
    console.log(token.target)
    if (token === undefined) return;

    if (token.target === selectedTokens[0].target) {
      transferToken(provider, exchange, "deposit", selectedTokens[0], depositAmount, dispatch)
      setDepositAmount(0)
    } else if (token.target === selectedTokens[1].target) {
      transferToken(provider, exchange, "deposit", selectedTokens[1], deposit2Amount, dispatch)
      setDeposit2Amount(0)
    }
  }

  const depositRef=useRef(null)
  const withdrawRef=useRef(null)

  const tabHandler=(e)=>{
    console.log(e.target.className)
    if(e.target.className !== depositRef.current.className){
      e.target.className='tab tab--active'
      depositRef.current.className='tab'
    }else{
      e.target.className='tab tab--active'
      withdrawRef.current.className='tab'
    }
    // e.target
  }

  useEffect(() => {
    if (exchange && selectedTokens[0] && selectedTokens[1] && account) {
      console.log("aggiorno balance")
      loadBalances(exchange, selectedTokens, account, dispatch)
    }
  }, [exchange, selectedTokens, account, transferInProgress])

  return (
    <div className='component exchange__transfers'>
      <div className='component__header flex-between'>
        <h2>Balance</h2>
        <div className='tabs'>
          <button ref={depositRef} className='tab tab--active' onClick={(e)=>tabHandler(e)}>Deposit</button>
          <button ref={withdrawRef} className='tab' onClick={(e)=>tabHandler(e)}>Withdraw</button>
        </div>
      </div>

      {/* Deposit/Withdraw Component 1 (SelectedToken1) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
          <p><small>Token</small><br />
            <img className="logo-small" src={logo} alt="" />{selectedSymbols && selectedSymbols[0]}</p>
          <p><small>Wallet</small><br />{tokenBalances && tokenBalances[0]}</p>
          <p><small>Exchange</small><br />{exchangeBalances && exchangeBalances[0]}</p>
        </div>

        <form onSubmit={(e) => depositHandler(e, selectedTokens[0])}>
          <label htmlFor="token0">{selectedSymbols && selectedSymbols[0]} Amount</label>
          <input type="text" id='token0'
            placeholder='0.0000'
            onChange={(e) => amountHandler(e, selectedTokens[0])}

          />

          <button className='button' type='submit'>
            <span>Deposit</span>
          </button>
        </form>
      </div>

      <hr />

      {/* Deposit/Withdraw Component 2 (SelectedToken1) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
          <p><small>Token</small><br />
            <img className="logo-small" src={eth} alt="" />{selectedSymbols && selectedSymbols[1]}</p>
          <p><small>Wallet</small><br />{tokenBalances && tokenBalances[1]}</p>
          <p><small>Exchange</small><br />{exchangeBalances && exchangeBalances[1]}</p>
        </div>

        <form onSubmit={(e) => depositHandler(e, selectedTokens[1])}>
          <label htmlFor="token1"></label>
          <input type="text" id='token1' placeholder='0.0000' onChange={(e) => amountHandler(e, selectedTokens[1])} />

          <button className='button' type='submit'>
            <span>Deposit</span>
          </button>
        </form>
      </div>

      <hr />
    </div>
  );
}

export default Balance;