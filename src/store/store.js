import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { provider, tokens } from './reducers'

const reducer = combineReducers({
    provider,
    tokens
})

const initialState = {}
const middleware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))
// const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk)))


export default store