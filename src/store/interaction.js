import { ethers } from 'ethers';
import { TOKEN_ABI } from '../abis/token_abi.js';

export const loadPROVA = (dispatch) => {
    dispatch({ type: "PROVA" })
}

export const loadProvider = (dispatch) => {
    const connection = new ethers.BrowserProvider(window.ethereum)
    dispatch({ type: "PROVIDER_LOADED", connection })

    // console.log(connection.BrowserProvider)
    return connection
}

export const loadNetwork = async (provider, dispatch) => {

    let { chainId } = await provider.getNetwork()
    chainId = Number(chainId)
    dispatch({ type: "NETWORK_LOADED", chainId })

    return chainId
}

export const loadAccount = async (dispatch) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.getAddress(accounts[0])

    dispatch({ type: "ACCOUNT_LOADED", account })

    return account
}


export const loadToken = async (provider, address, dispatch) => {
    let token, symbol

    token = new ethers.Contract(address, TOKEN_ABI, provider)
    symbol = await token.symbol()

    dispatch({ type: "TOKEN_LOADED", token, symbol })

    return token
}


