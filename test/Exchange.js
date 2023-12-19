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
  let amount
  let deployer, feeAccount, exchange, token1
  const feePercent = 10

  beforeEach(async ()=>{
    
    const Exchange = await ethers.getContractFactory('Exchange')
    const Token = await ethers.getContractFactory('Token')
   
    token1 = await Token.deploy(name, symbol, totalSupply)
    token2 = await Token.deploy("Mock DAI", "mDai", totalSupply)
    amount = tokens(10) 
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    feeAccount = accounts[1]
    user1 = accounts[2]
    user2 = accounts[3]

    let tx1= await token1.connect(deployer).transfer(user1, tokens(100))
    res= await tx1.wait()
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
   
   
     describe('Success',  () => {
       
      beforeEach(async () => {     
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

      
       it('tracks the token deposit', async () => { 
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

  describe('Withdraw Tokens', () => {
    let tx, result, events, event, filter, args
   
     describe('Success',  () => {
      beforeEach(async () => {     
        // console.log("balance prima di prelevare",await token1.balanceOf(exchange))
     
        tx= await token1.connect(user1).approve(exchange, amount)
        result = await tx1.wait()
        // // //Deposit
        tx = await exchange.connect(user1).depositToken(token1.target, amount)
        result= await tx.wait()
        
        // //Withdraw
        tx = await exchange.connect(user1).withdrawToken(token1.target, amount)
        result = await tx.wait()
                  
        //Leggi Evento con Ether v6.
         filter = exchange.filters.Withdraw
         events = await exchange.queryFilter(filter, -1)
         event = events[0]
         args = event.args
      })

      
       it('withdraws token funds', async () => { 
          expect(await token1.balanceOf(exchange.target)).to.equal(0)       
          expect(await exchange.tokens(token1.target, user1.address)).to.equal(0)       
          expect(await exchange.balanceOf(token1.target, user1.address)).to.equal(0)       

       })  
      
       it('emit a withdraw event',() => {
        expect(event.fragment.name).to.equal('Withdraw')
        
        expect(args[0]).to.equal(token1.target)
        expect(args[1]).to.equal(user1.address)
        expect(args[2]).to.equal(amount)
        expect(args[3]).to.equal(0)
       })

    })

    describe('Failure', ()=>{
      it('fails when no tokens are present', async() => {
        await expect(exchange.connect(user1).withdrawToken(token1.target, amount)).to.be.reverted
      })
    })
    
  })   
  
  describe('Checking Balances', () => {
    let tx
        
      beforeEach(async () => {     
        amount= tokens(1)
        //Approve
        tx1= await token1.connect(user1).approve(exchange, amount)
        let result = await tx1.wait()
        // //Deposit
        tx = await exchange.connect(user1).depositToken(token1.target, amount)
        result= await tx.wait()
             
      })
      
       it('return user balance', async () => { 
          expect(await exchange.balanceOf(token1.target, user1.address)).to.equal(amount)       
        
       })      
    
  })   

  describe('Making orders', async  () => {
      let tx, result
      amount= tokens(1)
      describe('Success', ()=>{
        beforeEach(async () => {     
         //Deposit before making the order
          //Approve
          tx= await token1.connect(user1).approve(exchange, amount)
          let result = await tx.wait()
          //Deposit
          tx = await exchange.connect(user1).depositToken(token1.target, amount)
          result= await tx.wait()

          tx = await exchange.connect(user1).makeOrder(token2.target, amount, token1.target, amount)
          let filter = exchange.filters.Order
          let events = await exchange.queryFilter(filter, -1)
          event = events[0]
          args = event.args
        })
        it('tracks the newly created order', async() => {
          expect(await exchange.orderCount()).to.equal(1)
        })
        it('emit a order event',() => {
          expect(event.fragment.name).to.equal('Order')
          
          expect(args[0]).to.equal(1)
          expect(args[1]).to.equal(user1.address)
          expect(args[2]).to.equal(token2.target)
          expect(args[3]).to.equal(amount)
          expect(args[4]).to.equal(token1.target)
          expect(args[5]).to.equal(amount)
          expect(args[6]).to.at.least(1)
         })
      })

      describe('Failure', ()=>{
        // beforeEach(async () => {     
       
        // })
        it('rejects with no balance',async ()=>{
          await expect(exchange.connect(user1).makeOrder(token2.target, amount, token1.target, amount)).to.be.reverted
        })
        // it('dunno yet', async() => {
          
        // })
      })      
      
    
  })   
})
