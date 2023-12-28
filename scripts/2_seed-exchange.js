// const hre = require("hardhat");
// npx hardhat run --network localhost scripts/2_seed-exchange.js 
const config= require('../src/config.json')


const tokens = (n)=>{
    return ethers.parseUnits(n.toString(), 'ether');
  }
  const toReadableValue=(n)=>{
    return ethers.formatUnits(n.toString())
  }
const wait=(seconds)=>{
    const milliseconds=seconds*1000
    return new Promise(resolve=>setTimeout(resolve,milliseconds))
}
async function main() {
    const accounts = await ethers.getSigners()
    console.log(`Account fetched:\n ${accounts[0].address}\n${accounts[1].address}\n`)

 
    const { chainId }= await ethers.provider.getNetwork()
    console.log("Using chainId:",chainId)
  

    
    const zilpioToken=await ethers.getContractAt("Token",config[chainId].ZilpToken.address)
    console.log(await zilpioToken.name())
    const mDAI=await ethers.getContractAt("Token",config[chainId].mDAI.address)
    console.log(await mDAI.name())
    const mEth=await ethers.getContractAt("Token",config[chainId].mETH.address)
    console.log(await mEth.name())

    const exchange=await ethers.getContractAt("Exchange",config[chainId].exchange.address)
 
    //Give tokens to account[1]
    const sender= accounts[0]
    getAmount(sender,zilpioToken)
    getAmount(sender,mDAI)
    getAmount(sender,mEth)
    const reciver= accounts[1]

    let amount=tokens(10000)

    //user1
    let tx,res
    tx=await mEth.connect(sender).transfer(reciver.address, amount)
    tx=await mEth.connect(sender).transfer(reciver.address, amount)
    await tx.wait()

    const user1= accounts[0]
    const user2= accounts[1]
  
    await wait(1)
    approveAndDeposit(user1,zilpioToken,exchange,amount)
    approveAndDeposit(user2,mEth,exchange,amount)
    await wait(1)

    let orderId1 = await makeOrder(exchange,user1,mEth, tokens(100),zilpioToken,tokens(5))
    cancelOrder(exchange,user1,orderId1)

    await wait(1)
//-----------------------------------

  

    orderId1 = await makeOrder(exchange, user2, zilpioToken, tokens(160),mEth,tokens(1600))    //chi fa l'ordine da via mEth
    fillOrder(exchange,user1,orderId1)
    await wait(1)
   
    //  let orderId2 = await makeOrder(exchange,user1,mEth, tokens(66),zilpioToken, tokens(160))
    //  fillOrder(exchange,user2,orderId2)
    //  await wait(1)

    //  let orderId3 = await makeOrder(exchange,user1,zilpioToken, tokens(10),mEth, tokens(10))   
    //  fillOrder(exchange,user2,orderId3)
    // await wait(1)
    
  
    await logAmountsOwned(exchange, user2, mEth)
    await logAmountsOwned(exchange, user2, zilpioToken)

    await logAmountsOwned(exchange, user1, mEth)
    await logAmountsOwned(exchange, user1, zilpioToken)

   

    //Some unfilled orders
for (let i = 1; i < 15; i++) {
    await makeOrder(exchange,user1,zilpioToken, tokens(3*i),mEth, tokens(10+2*i))
    await wait(.1)

    await makeOrder(exchange,user2,mEth, tokens(5+2*i),zilpioToken, tokens(10+3*i))
    await wait(.1)
}      
    

    

    // fillOrder(exchange,user1,orderId2)
}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  

  async function approveAndDeposit(user, token, exchange, depositamount) {
    console.log("approveAndDeposit")
    tx= await token.connect(user).approve(exchange.target, depositamount)
    await tx.wait()   
    tx= await exchange.connect(user).depositToken(token.target, depositamount)
    await tx.wait()

    console.log(`User: ${user.address} deposita ${toReadableValue(depositamount)} in ${await token.name()}`)
  }

  async function getAmount(user, token) {

    let amount=await token.balanceOf(user.address)
    // console.log(amount)
    console.log(`User ${user.address} has ${toReadableValue(amount)} many ${await token.name()}`)

  }

  async function makeOrder(exchange, user, tokenIn,amountIn,tokenOut,amountOut) {
    console.log("makeOrder")
   let tx= await exchange.connect(user).makeOrder(tokenIn.target,amountIn,tokenOut.target,amountOut)
   let res=await tx.wait()
   let filter = exchange.filters.OrderEvent
   let events = await exchange.queryFilter(filter, -1)
   orderId = events[0].args[0]
    console.log(`Ordine ${orderId} creato`)
     return  orderId
  }


  async function cancelOrder(exchange, user, orderId) {
    console.log("cancelOrder")
   let tx = await exchange.connect(user).cancelOrder(orderId)
   let res = await tx.wait()
   console.log(`Ordine ${orderId} cancellato`)
//    console.log(res)
  }
  async function fillOrder(exchange, user, orderId) {
    console.log("fillOrder")
    let tx = await exchange.connect(user).fillOrder(orderId)
    let res = await tx.wait()
    console.log(`Ordine ${orderId} fillato?`)
 //    console.log(res)
   }

   
  async function logAmountsOwned(exchange, user, token ){
    let token1Name=await token.name()

    let tokensHad=await exchange.balanceOf(token.target, user.address)

    console.log(token1Name,"posseduti: ",toReadableValue(tokensHad))
    
   }

