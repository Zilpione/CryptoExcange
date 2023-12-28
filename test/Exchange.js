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
    let tx2= await token1.connect(deployer).transfer(user2, tokens(100))
    let tx3 = await token2.connect(deployer).transfer(user2, tokens(100))

    await tx2.wait()
    await tx3.wait()
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
      let tx, result,event
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
          result= await tx.wait()
          
          let filter = exchange.filters.OrderEvent
          
          let events = await exchange.queryFilter(filter, -1)
          event = events[0]
          evt = events[0].args         
        })

        it('tracks the newly created order', async() => {
          expect(await exchange.orderCount()).to.equal(1)
        })
        it('emit a order event',() => {
          
          expect(event.fragment.name).to.equal('OrderEvent')
          
          expect(evt[0]).to.equal(1)
          expect(evt[1]).to.equal(user1.address)
          expect(evt[2]).to.equal(token2.target)
          expect(evt[3]).to.equal(amount)
          expect(evt[4]).to.equal(token1.target)
          expect(evt[5]).to.equal(amount)
          expect(evt[6]).to.at.least(1)
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

  describe('Order Actions', async  () => {
    let tx, orderId, events
   
    amount2= tokens(2)

    beforeEach(async () => {     
      //Deposit before making the order
       //Approve
       amount= tokens(1)
       tx= await token1.connect(user1).approve(exchange, amount)
       let result = await tx.wait()
       //Deposit
       tx = await exchange.connect(user1).depositToken(token1.target, amount)
       result= await tx.wait()

       tx= await token2.connect(user2).approve(exchange, amount2)
       result = await tx.wait()
       tx = await exchange.connect(user2).depositToken(token2.target, amount2)
       result= await tx.wait()

      //  console.log("amount: ",amount);
      //  console.log("amount2: ",amount2);
       tx = await exchange.connect(user1).makeOrder(token2.target, amount, token1.target, amount)
       result= await tx.wait()

       let filter = exchange.filters.OrderEvent
       events = await exchange.queryFilter(filter, -1)
       orderId = events[0].args[0]
             
     })

    describe('Cancelling orders', async  () => {
      beforeEach(async()=>{
        tx=await exchange.connect(user1).cancelOrder(orderId)
        result= await tx.wait()
              

        filter = exchange.filters.CancelEvent
        events = await exchange.queryFilter(filter, -1)
        evt=events[0].args
      })
      describe('Success',  ()=>{
        it('cancel the order', async () => {
            expect(await exchange.orderCancelled(orderId)).to.equal(true)
        })    
        it('emit a cancel event',async () => {
        
          expect(events[0].fragment.name).to.equal('CancelEvent')
          
          expect(evt[0]).to.equal(orderId)
          expect(evt[1]).to.equal(user1.address)
          expect(evt[2]).to.equal(token2.target)
          expect(evt[3]).to.equal(amount)
          expect(evt[4]).to.equal(token1.target)
          expect(evt[5]).to.equal(amount)
          expect(evt[6]).to.at.least(1)
        })  
      })    
      describe('Failure', ()=>{
        let user2orderId
        beforeEach(async () => {     
      
          // let tx2= await token1.connect(deployer).transfer(user2, tokens(100))
          // await tx2.wait()
          tx= await token1.connect(user2).approve(exchange, amount)
          let result = await tx.wait()
          //Deposit
          tx = await exchange.connect(user2).depositToken(token1.target, amount)
          result= await tx.wait()
  
          tx = await exchange.connect(user2).makeOrder(token2.target, amount, token1.target, amount)
          result= await tx.wait()
        
          let filter2 = exchange.filters.OrderEvent
          events = await exchange.queryFilter(filter2, -1)
          user2orderId = events[0].args[0]
        
        })
        it('rejects invalid order id ',async ()=>{
        //   tx=await exchange.connect(user1).cancelOrder(orderId)
        //  result= await tx.wait()
        const invalidOrderId = 999;
          await expect(exchange.connect(user1).cancelOrder(invalidOrderId)).to.be.reverted
        })
        // it('dunno yet', async() => {
          
        // })
          
      it('rejects unauthorize cancelations',async ()=>{     
        // console.log(user2orderId) 
          await expect(exchange.connect(user1).cancelOrder(user2orderId)).to.be.reverted

          await expect(exchange.connect(user2).cancelOrder(1)).to.be.reverted
        })
      }) 
    })

    describe('Filling orders', async  () => {
      beforeEach(async ()=>{
        amount= tokens(1)
        // console.log(orderId)
        tx = await exchange.connect(user2).fillOrder(orderId)
        result = await tx.wait()

        let filter = exchange.filters.TradeEvent
        events = await exchange.queryFilter(filter, -1)
        
      })
      describe('Success',  ()=>{
     
        it('executes the trade and charge fees', async () => {
                  
          expect(await exchange.balanceOf(token1.target, user1.address)).to.equal(tokens(0))          
          expect(await exchange.balanceOf(token1.target, user2.address)).to.equal(tokens(1))          
          expect(await exchange.balanceOf(token1.target, feeAccount.address)).to.equal(tokens(0))          
          
          expect(await exchange.balanceOf(token2.target, user1.address)).to.equal(tokens(1))          
          expect(await exchange.balanceOf(token2.target, user2.address)).to.equal(tokens(0.9))          
          expect(await exchange.balanceOf(token2.target, feeAccount.address)).to.equal(tokens(0.1))          
          
        })    
        it('emit a trade event',async () => {
        
          expect(events[0].fragment.name).to.equal('TradeEvent')
          evt = events[0].args    
          // console.log(user1.address)
          // console.log(user2.address)
          // console.log(token2.target)
          // console.log(token1.target)

          // console.log(evt)
          expect(evt[0]).to.equal(orderId)
          expect(evt[1]).to.equal(user2.address)
          expect(evt[2]).to.equal(token2.target)
          expect(evt[3]).to.equal(amount)
          expect(evt[4]).to.equal(token1.target)
          expect(evt[5]).to.equal(amount)
          expect(evt[6]).to.equal(user1.address)
          expect(evt[7]).to.at.least(1)
        })  
      
        it('it Update orderFilled',async () => {
          expect(await exchange.orderFilled(1)).to.equal(true)        
        })  
      })   
      describe('Failure', ()=>{
        
        beforeEach(async () => {     
      
        })
        it('rejects invalid order ids ',async ()=>{
          await  expect( exchange.connect(user2).fillOrder(0)).to.be.reverted
          await  expect( exchange.connect(user2).fillOrder(123)).to.be.reverted          
        })

        it('rejects already filled  orders',async ()=>{
          await expect( exchange.connect(user2).fillOrder(orderId)).to.be.reverted
        })
        
        it('rejects deleted order ',async ()=>{

          tx = await exchange.connect(user1).makeOrder(token1.target, amount, token2.target, amount)
          result= await tx.wait()
   
          let filter = exchange.filters.OrderEvent
          events = await exchange.queryFilter(filter, -1)
          orderId = events[0].args[0]

          tx =await exchange.connect(user1).cancelOrder(orderId)
          await expect( exchange.connect(user2).fillOrder(orderId)).to.be.rejected
        })
        
          
     
      }) 
    })

})
}) 

