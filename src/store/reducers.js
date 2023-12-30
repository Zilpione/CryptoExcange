export const provider = (state = {}, action) => {

    switch (action.type) {
        case 'PROVIDER_LOADED':
            console.log("Loaded", action.connection)
            return {
                ...state,// copia lo stato attuale e aggiorna connection
                connection: action.connection
            }
        case 'NETWORK_LOADED':
            console.log("Loaded", action.chainId)
            return {
                ...state,// copia lo stato attuale e aggiorna connection
                chainId: action.chainId
            }
        case 'ACCOUNT_LOADED':
            console.log("Loaded", action.account)
            return {
                ...state,// copia lo stato attuale e aggiorna connection
                account: action.account
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

export const tokens = (state = { loaded: false, contract: null }, action) => {

    switch (action.type) {
        case 'TOKEN_LOADED':
            console.log("Loaded Token", action.token)
            console.log("Loaded Symbol", action.symbol)
            return {
                ...state,
                loaded:true,
                contract:action.token,
                symbol: action.symbol
            }
            default:
                return state
    }

}
