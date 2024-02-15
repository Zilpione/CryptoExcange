import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { default as Balance } from './Balance';
import Markets from './Markets';
import Navbar from './Navbar';
import Order from './Order';
import OrderBook from './OrderBook';
// 
// import { BrowserProvider, parseUnits } from "ethers";
// npm run start

import { loadAccount, loadExchange, loadNetwork, loadProvider, loadTokens, subscribeToEvents } from '../store/interaction';
const config = require('../config.json')
let provider;
// var loaded = false;
function App() {
  const [loaded, setLoaded] = useState(false);
  
  const dispatch = useDispatch()
  
  useEffect(() => {
   
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {

    console.log("Starting...")
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
      
      //Load TOkens
      const mDAI = config[chainId].mDAI
      const ZilpToken = config[chainId].ZilpToken
      const mETH = config[chainId].mETH
      // console.log(mDAI,ZilpToken,mETH)
      await loadTokens(provider,
        [mDAI.address, ZilpToken.address, mETH.address],
        dispatch)

      //Load exchange Contract
      const exchangeContract=await loadExchange(provider, config[chainId].exchange.address, dispatch)

      subscribeToEvents(exchangeContract, dispatch)
    }

    console.log("Loaded!")
  
    setLoaded(true);
  };
  


  return (
   

       
        <div>
          {loaded ? (
            <>
        <Navbar />

        <main className='exchange grid'>
          <section className='exchange__section--left grid'>
  
            <Markets />
  
            <Balance />
  
            <Order />
  
          </section>
          <section className='exchange__section--right grid'>
  
            {/* PriceChart */}
  
            {/* Transactions */}
  
            {/* Trades */}
  
            <OrderBook/>
  
          </section>
        </main>
  
        {/* Alert */}
        </>
        ) : (
          // Puoi visualizzare uno spinner o un messaggio di caricamento
          <p>Caricamento in corso...</p>
        )}
        </div>
    //   )
     
      
    // }
    
    
  );
}

export default App;