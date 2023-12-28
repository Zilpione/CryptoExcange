import { useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserProvider, parseUnits } from "ethers";
import '../App.css';
import { TOKEN_ABI } from '../abis/token_abi.js';

 const config= require('../config.json')

function App() {

  const loadBlockchainData = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    console.log(accounts)
    // console.log(ethers)

    const provider = new ethers.BrowserProvider(window.ethereum);
    // const provider=new ethers.provider.Web3Provider(window.ethereum)
    const network = await provider.getNetwork()
    // const { chainId } = await provider.getNetwork()
    console.log(network)
    // console.log(TOKEN_ABI)

    const token= new ethers.Contract(config[31337].ZilpToken.address, TOKEN_ABI, provider)
    // console.log(config[31337].ZilpToken.address)
    console.log(token)
    console.log("diocane1")
    const symbol = await token.name()
    console.log("diocane2")
    console.log(symbol)
    console.log("diocane3")
    
    //  const zilpioToken=await ethers.getContractAt("Token",config[chainId].ZilpToken.address)
    //  console.log(await zilpioToken.name())
    //  const mDAI=await ethers.getContractAt("Token",config[chainId].mDAI.address)
    //  console.log(await mDAI.name())
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