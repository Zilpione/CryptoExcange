import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// import { BrowserProvider, parseUnits } from "ethers";
// npm run start

import { loadAccount, loadExchange, loadNetwork, loadProvider, loadTokens } from '../store/interaction';
const config = require('../config.json')

function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
     
    //Connect Ethers to bc
    const provider = loadProvider(dispatch)
    //Fetch ChainID ()
    const chainId = await loadNetwork(provider, dispatch)

    //Load Metamask Account e Balance
    const account = await loadAccount(provider,dispatch)


    //Load TOkens
    const mDAI= config[chainId].mDAI
    const ZilpToken= config[chainId].ZilpToken
    const mETH= config[chainId].mETH

    const daiToken = await loadTokens(provider,
    [mDAI.address, ZilpToken.address, mETH.address ],
      dispatch)

    //Load exchange Contract
    const exchange = await loadExchange(provider, config[chainId].exchange.address, dispatch)
   
    
  }

  useEffect(() => {
    loadBlockchainData()

  })

  return (
    <div>

      {/* Navbar */}

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