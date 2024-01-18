export const provider = (state = {}, action) => {
    // console.log("Provider", action.type)
    switch (action.type) {
        case 'PROVIDER_LOADED':
            // console.log("Loaded", action.connection.provider)
            return {
                ...state,// copia lo stato attuale e aggiorna connection
                connection: action.connection
            }
        case 'NETWORK_LOADED':
            // console.log("Loaded", action.chainId)
            return {
                ...state,// copia lo stato attuale e aggiorna connection
                chainId: action.chainId
            }
        case 'ACCOUNT_LOADED':
            // console.log("Loaded", action.account)
            return {
                ...state,// copia lo stato attuale e aggiorna connection
                account: action.account
            }
        case 'ETHER_BALANCE_LOADED':
            // console.log("Loaded", action.account)
            return {
                ...state,// copia lo stato attuale e aggiorna connection
                balance: action.balance
            }
        case 'PROVA':

            return {
                ...state,// copia lo stato attuale e aggiorna connection
                txt: "DIOCANE"
            }
        default:
            return state
    }

}

// export const tokens = (state = { loaded: false, contract: null }, action) => {

//     switch (action.type) {
//         case 'TOKEN_LOADED':
//             console.log("Loaded Token", action.token)
//             console.log("Loaded Symbol", action.symbol)
//             return {
//                 ...state,
//                 loaded:true,
//                 contract:action.token,
//                 symbol: action.symbol
//             }
//             default:
//                 return state
//     }

// }

const DEFAULT_TOKEN_STATE = {
    loaded: false,
    contracts: [],
    symbols: []
}

export const tokens = (state = DEFAULT_TOKEN_STATE, action) => {

    // console.log("Tokens", action.type)
    // console.log('TOKEN_LOADED'==action.type)
    switch (action.type) {
        case 'TOKEN_LOADED':
            // console.log("Loaded Token", action.token)
            // console.log("Loaded Symbol", action.symbol)
            return {

                ...state,
                loaded: true,
                contracts: [...state.contracts, action.token],
                symbols: [...state.symbols, action.symbol]
            }
        case 'EXCHANGE_LOADED':
            return {

                ...state,
                loaded: true,
                exchange: action.exchange,

            }
        default:
            return state
    }

}

export const exchange = (state = {loaded: false, contract: {}}, action) => {
    switch (action.type) {
        case 'EXCHANGE_LOADED':
            return {

                ...state,
                loaded: true,
                contract: action.exchange,

            }
        default:
            return state
    }

}