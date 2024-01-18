import Blockies from 'react-blockies';
import { useDispatch, useSelector } from 'react-redux';
import config from '../config.json';
import { loadAccount, loadProvider } from '../store/interaction';
const Account = ({provider2}) => {
    const dispatch = useDispatch()
    const account = useSelector(state => state.provider.account)
    const balance = useSelector(state => state.provider.balance)
    const chainId = useSelector(state => state.provider.chainId)


    let _provider = useSelector(state => state.provider.connection)
    //  let _provider = provider

    if (!_provider) {
        console.log("Provider non trovato, riprovo...")
        _provider = loadProvider(dispatch)
        if (!_provider) {
            console.error("Provider non trovato!")
        }

     }
    const provider = _provider

    const connectHandler = async () => {
        //LoadAccount
        await loadAccount(provider, dispatch)
    }
    return (
        <div className='exchange__header--account flex'>

            {balance ? <p><small> Balance</small> {Number(balance).toFixed(4)} ETH</p> : <p>-</p>}
            {
                account ?
                    <a 
                    href={config[chainId]? `${config[chainId].explorerURL}/${account}`:`#`} 
                    target="blank" rel="norefferer" title={account}>
                        <Blockies seed={account} className="identicon" size={10} scale={3} color="#2187D0" bgColor="#F1F2F9" spotColor="#767F92" />
                        {account.slice(0, 7)}...{account.slice(37, 42)}
                    </a>
                    :
                    <button className="button" onClick={connectHandler}>Connect</button>
            }
            {/* { balance ? <a href="" title={balance}>{balance.slice(0, 7)} ETH</a> :<p>-</p>} */}
        </div>

    )
}

export default Account;