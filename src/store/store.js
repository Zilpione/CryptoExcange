import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { exchange, provider, selectedTokens, tokens } from './reducers';

const reducer = combineReducers({
    provider,
    tokens,

    selectedTokens,
    exchange
})

const initialState = {}
const middleware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))
// const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk)))
// const advancedComposeEnhancers = composeWithDevTools({
//     maxAge: 500,
//     trace: true,
//     serialize: {
//       function: (_key, value) => {
//         return typeof value === 'BigInt' ? Number(value) : value;
//       },
//     },
//   });

// const store = createStore(reducer, initialState, advancedComposeEnhancers(applyMiddleware(...middleware)))

export default store