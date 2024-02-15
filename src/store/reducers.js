export const provider = (state = {}, action) => {
    // console.log("Provider", action.type)
    switch (action.type) {
        case 'PROVIDER_LOADED':
            // console.log("Loaded", action.connection.provider)
            return {
                ...state,// copia lo stato attuale e aggiorna connection
                // connection: {...action.connection}
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

        default:
            return state
    }

}

export const selectedTokens = (state = DEFAULT_TOKEN_STATE, action) => {
    switch (action.type) {
        case 'SELECTED_TOKEN_LOADED':
            return {

                ...state,
                loaded: true,
                contracts: action.tokens,
                symbols: action.symbols
            }

        case 'BALANCE_1_LOADED':

            // console.log("carico uno stato: ",action.balance)
            // console.log(action.balance)
            return {

                ...state,
                loaded: true,
                balances: [action.balance],

            }
        case 'BALANCE_2_LOADED':
            return {

                ...state,
                loaded: true,
                balances: [...state.balances, action.balance],
            }


        default:
            return state
    }

}

const DEFAULT_EXCHANGE_STATE = {
    loaded: false,
    contract: {},
    transaction: {
        isSuccessful: false
    },
    allOrders: {
        loaded: false,
        data: []
    },
    events: []

}
export const exchange = (state = DEFAULT_EXCHANGE_STATE, action) => {
    let index, data

    switch (action.type) {
        case 'EXCHANGE_LOADED':
            return {

                ...state,
                loaded: true,
                contract: action.exchange,

            }
        case 'BALANCE_EXCHANGE_1_LOADED':
            return {

                ...state,
                loaded: true,
                balances: [action.balanceExchange],

            }
        case 'BALANCE_EXCHANGE_2_LOADED':
            return {

                ...state,
                loaded: true,
                balances: [...state.balances, action.balanceExchange],
            }
        case 'TRANSFER_REQUEST':
            console.log("TRANSFER_REQUEST")
            return {
                ...state,
                transaction: {
                    transactionType: 'Transfer',
                    isPending: true,
                    isSuccesful: false

                },
                transferInProgress: true
            }

        case 'TRANSFER_SUCCESS':
            console.log("TRANSFER_SUCCESS")
            return {
                ...state,
                transaction: {
                    transactionType: 'Transfer',
                    isPending: false,
                    isSuccesful: true

                },
                transferInProgress: false,
                events: [action.evt]
            }

        case 'TRANSFER_FAIL':
            console.log("TRANSFER_FAILs")
            return {
                ...state,
                transaction: {
                    transactionType: 'Transfer',
                    isPending: false,
                    isSuccesful: false

                },
                transferInProgress: false,
                events: [action.error]
            }
        case 'NEW_ORDER_REQUEST':
            console.log("NEW_ORDER_REQUEST")
            return {
                ...state,
                transaction: {
                    transactionType: 'New Order',
                    isPending: true,
                    isSuccesful: false

                }
            }
        case 'NEW_ORDER_FAIL':
            console.log("NEW_ORDER_FAIL")
            return {
                ...state,
                transaction: {
                    transactionType: 'New Order',
                    isPending: false,
                    isSuccesful: false,
                    isError: true
                },
                events: [action.error]
            }
        case 'NEW_ORDER_SUCCESS':
            console.log("NEW_ORDER_SUCCESS")
            // console.log(action.orderId)
            // console.log(state.allOrders.data)
            // console.log(action.data.orderId)
            //Handle duplicate
           index = state.allOrders.data.findIndex(order => order[0] == action.data.orderId)
                   
            if (index === -1) {
                data = [...state.allOrders.data, action.data]
            } else {
                data = state.allOrders.data
            }
            return {
                ...state,
                allOrders: {
                    ...state.allOrders,
                    data: data
                },
                transaction: {
                    transactionType: 'New Order',
                    isPending: false,
                    isSuccesful: true,
                    isError: false
                },
                // events: [action.evt, ...state.events]
            }

        default:
            return state
    }

}