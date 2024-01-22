
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../assets/ZilpioGmaingLogoTransparent.png';
import { loadBalances, transferToken } from '../store/interaction';

const Balance = () => {
  const [depositAmount, setDepositAmount] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(false);
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

  const amountDepositHandler = (e, token) => {
    if (token.address === selectedTokens[0].address) {
      setDepositAmount(e.target.value)
      console.log(depositAmount)
    }
  }
  const depositHandler = (e, token) => {
    e.preventDefault()
    if (token.address === selectedTokens[0].address) {

      transferToken(provider, exchange, "deposit", selectedTokens[0], depositAmount, dispatch)
      setDepositAmount(0)
    }
  }
  const amountWithdrawHandler = (e, token) => {
    if (token.address === selectedTokens[1].address) {
      setWithdrawAmount(e.target.value)
      console.log(withdrawAmount)
    }

  }

  const withdrawHandler = (e, token) => {
    e.preventDefault()
    if (token.address === selectedTokens[1].address) {

      console.log(withdrawAmount)
      setWithdrawAmount(0)
    }

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
          <button className='tab tab--active'>Deposit</button>
          <button className='tab'>Withdraw</button>
        </div>
      </div>

      {/* Deposit/Withdraw Component 1 (DApp) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
          <p><small>Token</small><br />
            <img className="logo-small" src={logo} alt="" />{selectedSymbols && selectedSymbols[0]}</p>

          <p><small>Wallet</small><br />{tokenBalances && tokenBalances[0]}</p>

          <p><small>Exchange</small><br />{exchangeBalances && exchangeBalances[0]}</p>
        </div>

        <form onSubmit={(e) => depositHandler(e, selectedSymbols[0])}>
          <label htmlFor="token0">{selectedSymbols && selectedSymbols[0]} Amount</label>
          <input type="text" id='token0'
           placeholder='0.0000' 
           onChange={(e) => amountDepositHandler(e, selectedTokens[0])}
       
           />

          <button className='button' type='submit'>
            <span>Deposit</span>
          </button>
        </form>
      </div>

      <hr />

      {/* Deposit/Withdraw Component 2 (mETH) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>

        </div>

        <form onSubmit={(e) => withdrawHandler(e, selectedSymbols[1])}>
          <label htmlFor="token1"></label>
          <input type="text" id='token1' placeholder='0.0000' onChange={(e) => amountWithdrawHandler(e, selectedTokens[1])} />

          <button className='button' type='submit'>
            <span>Withdraw</span>
          </button>
        </form>
      </div>

      <hr />
    </div>
  );
}

export default Balance;