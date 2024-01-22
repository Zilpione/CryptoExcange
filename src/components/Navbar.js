import { useDispatch, useSelector } from 'react-redux';
import logo from '../assets/ZilpioGmaingLogoTransparent.png';
import ethlogo from '../assets/eth.svg';
import config from '../config.json';
import Account from './Account';


const networkHandler = async (evt) => {
  console.log("network", evt.target.value)
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: evt.target.value }]
    })
  } catch (error) {
    console.log("Catched meh")
    console.log(error)
  }

  // chainId = Number(chainId)
  // dispatch({ type: "NETWORK_LOADED", chainId })
}
const Navbar = ({ provider }) => {
  const appName = "Zilpio Exchange"

  const dispatch = useDispatch()
  const chainId = useSelector(state => state.provider.chainId)
  // console.log(chainId)


  return (
    <div className='exchange__header grid'>
      <div className='exchange__header--brand flex'>
        <img src={logo} className="logo" alt=""></img>
        <h1>{appName}</h1>
      </div>

      <div className='exchange__header--networks flex'>
        <img src={ethlogo} alt="-" className="Eth Logo" />
        {chainId && (
          <select name="networs" id="networks" value={config[chainId] ? `0x${chainId.toString(16)}` : 0} onChange={networkHandler}>
            <option value="0" disabled> Select Network</option>
            <option value="0x7A69" > Localhost</option>
            <option value="0xaa36a7">Sepolia</option>
          </select>
        )}

      </div>


      <Account provider2={provider} />


    </div>
  )
}

export default Navbar;