import { ethers } from 'ethers';
// import { TOKEN_ABI } from '../abis/token_abi.js';
import TOKEN_ABI from '../abis/Token.json';
import { EXCHANGE_ABI } from '../abis/exchange_abi.js';

export const loadPROVA = (dispatch) => {
    dispatch({ type: "PROVA" })
}
const wait = (seconds) => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// export const loadProvider = (dispatch) => {
//     const connection = new ethers.BrowserProvider(window.ethereum)
//     dispatch({ type: "PROVIDER_LOADED", connection })

//     // console.log(connection.BrowserProvider)
//     return connection
// }

export const loadProvider = async (dispatch) => {

    const provider = new ethers.BrowserProvider(window.ethereum)

    var connection = provider.provider
    dispatch({ type: "PROVIDER_LOADED", connection })

    //  console.log(provider)
    //  console.log(connection)
    //  console.log(connection.BrowserProvider)

    return connection
}


export const loadNetwork = async (provider, dispatch) => {
    try {
        let { chainId } = await provider.getNetwork()

        chainId = Number(chainId)
        dispatch({ type: "NETWORK_LOADED", chainId })

        return chainId
    } catch (error) {
        console.error(error)
        return undefined
    }

}

export const loadAccount = async (provider, dispatch) => {
    // console.log("LoadAccount")
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.getAddress(accounts[0])

    dispatch({ type: "ACCOUNT_LOADED", account })
    // await wait(1)
    try {
        let balance = await provider.getBalance(account)
        balance = ethers.formatEther(balance)
        dispatch({ type: "ETHER_BALANCE_LOADED", balance })
    } catch (error) {
        dispatch({ type: "ETHER_BALANCE_LOADED", balance: 0 })
        console.error(error)
    }

    return account
}

export const loadToken = async (provider, address, dispatch) => {

    let token = new ethers.Contract(address, TOKEN_ABI, provider)
    // console.log("TOKEN_LOADED", token)
    try {
        let symbol = await token.symbol()
        // console.log(await token.balanceOf)

        //If doesn't go on you need to reload the nodes and deploy the stuff...
        //npx hardhat run --network localhost scripts/1_deploy.js
        //npx hardhat run --network localhost scripts/2_seed-exchange.js
        //npx hardhat node
        // console.log("TOKEN_LOADED", symbol)
        dispatch({ type: "TOKEN_LOADED", token, symbol })
    } catch (error) {

        console.error("meh")
        console.error(error)
    }


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

export const loadSelectedTokens = async (provider, addresses, dispatch) => {
    let tokens = [];
    let symbols = [];

    for (const address of addresses) {

        let token = new ethers.Contract(address, TOKEN_ABI, provider)
        tokens.push(token);
        let symbol = await token.symbol()
        symbols.push(symbol);
    };

    try {
        dispatch({ type: "SELECTED_TOKEN_LOADED", tokens, symbols })
    } catch (error) {

        console.error("SELECTED_TOKEN_LOADED---meh")
        console.error(error)
    }
}

export const loadExchange = async (provider, address, dispatch) => {
    let exchange = new ethers.Contract(address, EXCHANGE_ABI, provider)
    dispatch({ type: "EXCHANGE_LOADED", exchange })
    return exchange
}

export const loadBalances = async (exchange, selectedTokens, account, dispatch) => {

    // console.log("loadBalances")
    // console.log(selectedTokens[0])

    let balance = await selectedTokens[0].balanceOf(account)
    balance = ethers.formatUnits(balance, 18)
    dispatch({ type: "BALANCE_1_LOADED", balance })

    let balanceExchange = await exchange.balanceOf(selectedTokens[0], account)
    balanceExchange = ethers.formatUnits(balanceExchange, 18)
    dispatch({ type: "BALANCE_EXCHANGE_1_LOADED", balanceExchange })

    let balance2 = await selectedTokens[1].balanceOf(account)
    balance2 = ethers.formatUnits(balance2, 18)
    dispatch({ type: "BALANCE_2_LOADED", balance: balance2 })

    let balanceExchange2 = await exchange.balanceOf(selectedTokens[1], account)
    balanceExchange2 = ethers.formatUnits(balanceExchange2, 18)
    dispatch({ type: "BALANCE_EXCHANGE_2_LOADED", balanceExchange: balanceExchange2 })

    return [balance, balance2, balanceExchange, balanceExchange2]
}


export const subscribeToEvents = (exchangeContract, dispatch) => {
    exchangeContract.on('Deposit', (evt) => {
        console.log("deposigted")

        dispatch({ type: "TRANSFER_SUCCESS", evt })
    })
}


export const transferToken = async (provider, exchange, transferType, token, amount, dispatch) => {
    try {
        console.log("depositing: ",{provider, exchange, transferType, token, amount, dispatch})

        if (transferType == "deposit") {
            dispatch({ type: "TRANSFER_REQUEST" })

            const signer = await provider.getSigner()
            const amountToTransfer = ethers.parseUnits(amount.toString(), 18)
console.log("asking for approve")
            let tx = await token.connect(signer).approve(exchange.target, amountToTransfer)
            await tx.wait()
            console.log("asking for deposit")
            tx = await exchange.connect(signer).depositToken(token.target, amountToTransfer)
            await tx.wait()

        } else if (transferType == "withdraw") {

        }


    } catch (error) {
        console.error(error)
        dispatch({ type: "TRANSFER_FAIL", error })
    }

}



