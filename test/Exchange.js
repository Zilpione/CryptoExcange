const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n)=>{
  return ethers.parseUnits(n.toString(), 'ether');
}
const toReadableValue=(n)=>{
  return ethers.formatUnits(n.toString())
}


// describe("Token", => () {
describe("Exchange", function  () {
  const name = "Zilpio Token Test"
  const symbol = "ZPTt"
  const totalSupply = 1000000
  
  let deployer, feeAccount, exchange, token1
  const feePercent = 10
  this.beforeEach(async ()=>{
    
    const Exchange = await ethers.getContractFactory('Exchange')
    const Token = await ethers.getContractFactory('Token')
   
    token1 = await Token.deploy(name, symbol, totalSupply)
          
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    feeAccount = accounts[1]
    user1 = accounts[2]
    user2 = accounts[3]

    let tx1= await token1.connect(deployer).transfer(user1, tokens(100))

    exchange = await Exchange.deploy(feeAccount, feePercent)

  })    
   
  describe('Deployment', ()=>{

    it('tracks the fee account', async()=>{
      expect(await exchange.feeAccount()).to.equal(feeAccount.address)
    })    

    it('tracks the fee percent', async()=>{
      expect(await exchange.feePercent()).to.equal(feePercent)

    })    
  })   

  describe('Depositing Tokens', () => {
    let tx, result, events, event, filter, args
    let amount = tokens(10)

    
     describe('Success',  () => {
       
      this.beforeEach(async () => {     
        //Approve
        tx1= await token1.connect(user1).approve(exchange, amount)
        result = await tx1.wait()
        // //Deposit
        tx = await exchange.connect(user1).depositToken(token1.target, amount)
        result= await tx.wait()
        
         //Leggi Evento con Ether v6.
         filter = exchange.filters.Deposit
         events = await exchange.queryFilter(filter, -1)
         event = events[0]
         args = event.args
      })

      
       it('tracks the token deposita', async () => { 
        expect(await token1.balanceOf(exchange)).to.equal(amount)       
        expect(await exchange.tokens(token1.target, user1.address)).to.equal(amount)       
        expect(await exchange.balanceOf(token1.target, user1.address)).to.equal(amount)       

       })  
      
       it('emit a Deposit event',() => {
        expect(event.fragment.name).to.equal('Deposit')
        // console.log(token1.target)
        // console.log(token1.address???)
       
        expect(args[0]).to.equal(token1.target)
        expect(args[1]).to.equal(user1.address)
        expect(args[2]).to.equal(amount)
        expect(args[3]).to.equal(amount)
       })

    })

    describe('Failure', ()=>{
      it('fails when no tokens are approved', async() => {
        await expect(exchange.connect(user1).depositToken(token1.target, amount)).to.be.reverted
      })
    })
    
  })   
})