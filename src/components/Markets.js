import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from '../config.json';
import { loadProvider, loadSelectedTokens } from '../store/interaction';
const Markets = () => {
  const dispatch = useDispatch()
  const chainId = useSelector(state => state.provider.chainId)
  const selectedSymbols = useSelector(state => state.selectedTokens.symbols)
  let _provider = useSelector(state => state.provider.connection)
  //  let _provider = provider

  if (!_provider) {
    // console.log("Provider non trovato, riprovo...")
    _provider = loadProvider(dispatch)
    if (!_provider) {
      console.error("Provider not Found!")
    }
  }
  const provider = _provider

  const marketHandler = async (evt) => {
    // console.log("market changed")
    let addresses = evt.target.value.split(",");
    // console.log(addresses)
    loadSelectedTokens(provider, addresses, dispatch)
  }

  if (selectedSymbols.length === 0) {
    // Imposta il valore predefinito o il valore desiderato quando la pagina si carica
    const defaultValue = `${config[chainId].ZilpToken.address},${config[chainId].mDAI.address}`;

    // Chiamata a marketHandler per eseguire le azioni desiderate
    marketHandler({ target: { value: defaultValue } });
  }





  return (
    <div className='component exchange__markets'>
      <div className='component__header'>
        <h2> Choose Market</h2>
      </div>

      {chainId && (
        <select name="markets" id="markets"
          //  value={config[chainId] ? `0x${chainId.toString(16)}` : 0} 
          onChange={marketHandler}>
          <option value="0" disabled> Select Market</option>
          <option value={`${config[chainId].ZilpToken.address},${config[chainId].mDAI.address}`} > Zpt/mDAI</option>
          <option value={`${config[chainId].ZilpToken.address},${config[chainId].mETH.address}`} > Zpt/mETH</option>
          {/* <option value="0xaa36a7">Zpt/mEth</option> */}
        </select>
      )}
      <hr />
    </div>
  )
}

export default Markets;