import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from './Navbar';

// import { BrowserProvider, parseUnits } from "ethers";
// npm run start

import { loadAccount, loadExchange, loadNetwork, loadProvider, loadTokens } from '../store/interaction';
const config = require('../config.json')
let provider;
function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {

    //Connect Ethers to bc
    provider = await loadProvider(dispatch)
    
    await loadAccount(provider, dispatch)
    
    window.ethereum.on('chainChanged', async () => {
      window.location.reload()
  })

    window.ethereum.on('accountsChanged', async () => {
        await loadAccount(provider, dispatch)
    })

    //Fetch ChainID ()
    let _chainId = 0
    try {
      _chainId = await loadNetwork(provider, dispatch)
    } catch (error) {
      console.log(error)
    }
    const chainId = _chainId

    if (chainId) {
      //Load Metamask Account e Balance

    console.log(chainId)

      //Load TOkens
      const mDAI = config[chainId].mDAI
      const ZilpToken = config[chainId].ZilpToken
      const mETH = config[chainId].mETH
// console.log(mDAI,ZilpToken,mETH)
      await loadTokens(provider,
        [ mDAI.address, ZilpToken.address, mETH.address],
        dispatch)

      //Load exchange Contract
      await loadExchange(provider, config[chainId].exchange.address, dispatch)

    }


  }

  useEffect(() => {
    loadBlockchainData()

  })

  return (
    <div>

      <Navbar provider={provider}/>

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;