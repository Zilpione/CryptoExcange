import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ethers } from 'ethers';
// import { BrowserProvider, parseUnits } from "ethers";
// npm run start

import { loadProvider, loadNetwork, loadAccount, loadToken } from '../store/interaction';
const config = require('../config.json')

function App() {

  const dispatch = useDispatch()
  const loadBlockchainData = async () => {

    const account = await loadAccount(dispatch)
    const provider = loadProvider(dispatch)
    const chainId = await loadNetwork(provider, dispatch)
    const daiToken = await loadToken(provider, config[chainId].mDAI.address, dispatch)
    const zilpioToken = await loadToken(provider, config[chainId].ZilpToken.address, dispatch)
    const mEthToken = await loadToken(provider, config[chainId].mETH.address, dispatch)


    //  const mEth=await ethers.getContractAt("Token",config[chainId].mETH.address)
    //  console.log(await mEth.name())


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