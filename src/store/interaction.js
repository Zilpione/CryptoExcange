import { ethers } from 'ethers';
// import { TOKEN_ABI } from '../abis/token_abi.js';
import TOKEN_ABI from '../abis/Token.json';
import { EXCHANGE_ABI } from '../abis/exchange_abi.js';

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

export const loadAccount = async (provider, dispatch) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.getAddress(accounts[0])

    dispatch({ type: "ACCOUNT_LOADED", account })


    let balance = await provider.getBalance(account)
    balance=ethers.formatEther(balance)
    dispatch({ type: "ETHER_BALANCE_LOADED", balance })


    return account
}


export const loadToken = async (provider, address, dispatch) => {

    let token = new ethers.Contract(address, TOKEN_ABI, provider)
    let symbol = await token.symbol()
    //If doesn't go on you need to reload the nodes and deploy the stuff...
    //npx hardhat run --network localhost scripts/1_deploy.js
    //npx hardhat run --network localhost scripts/2_seed-exchange.js
    //npx hardhat node

    dispatch({ type: "TOKEN_LOADED", token, symbol })

    return token
}

export const loadTokens = async (provider, addresses, dispatch) => {

    // if (Array.isArray(addresses)) {
    let tokens = [];

    for (const address of addresses) {

        tokens.push(loadToken(provider, address, dispatch));

    };

    return tokens
    // } else {
    //     return loadToken(provider, addresses, dispatch);
    // }
}

export const loadExchange = async (provider, address, dispatch)=>{
    let exchange = new ethers.Contract(address, EXCHANGE_ABI, provider)
    dispatch({ type: "EXCHANGE_LOADED", exchange })
    return exchange
}


