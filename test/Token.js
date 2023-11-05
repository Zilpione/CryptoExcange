const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens= (n)=>{
  return ethers.parseUnits(n.toString(), 'ether');
}
const toReadableValue=(n)=>{
  return ethers.formatUnits(n.toString())
}

// describe("Token", => () {
describe("Token", function  () {
   
  let token, accounts, deployer, exchange
    const name = "Zilpio Token Test"
    const symbol = "ZPTt"
    const totalSupply = 1000000

    this.beforeEach(async ()=>{
      //Fetch Token
      const Token = await ethers.getContractFactory('Token')
      token = await Token.deploy(name,symbol, totalSupply)
      
      accounts = await ethers.getSigners()
      deployer = accounts[0]
      reciver = accounts[1]
      exchange = accounts[2]
      // account3 = accounts[3]
    })    
   
    describe('Deployment',()=>{

      it('has a name', async ()=>{
        //Read name
       const nameFound = await token.name()
       //check if its correct  //schould, espect
       expect(nameFound).to.equal(name)
      })
  
      it('has correct Symbol', async ()=> expect(await token.symbol()).to.equal(symbol) )
      it('has correct Decimal', async ()=> expect(await token.decimals()).to.equal(18) )
      it('has correct totalSupply', async ()=>{
          expect(await token.totalSupply()).to.equal(tokens(totalSupply)) 
      })
      it('assign total supply to deployer', async ()=>{
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(totalSupply)) 
      })
   
    })
   
    describe('Sending Tokens', ()=>{
     
      describe("Sussess", ()=>{     
        let amount, transaction, result, event, args
        //Log balance after
        beforeEach(async ()=>{
          // console.log("deployer balance before transfer", toReadableValue(await token.balanceOf(deployer.address)))
          // console.log("reciver balance before transfer", toReadableValue(await token.balanceOf(reciver.address)))
  
          amount = tokens(100);
          transaction = await token.connect(deployer).transfer(reciver, amount)
          result = await transaction.wait()
          // let logs= result.logs
          // console.log('transaction events', logs);
          
         
          //Leggi Evento con Ether v6.
          filter = token.filters.Transfer
          events = await token.queryFilter(filter, -1)
          event = events[0]
          args = event.args
          // console.log(event)
        })
  
        it('transfer token balanches', async ()=>{
          expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
          expect(await token.balanceOf(reciver.address)).to.equal(amount)
          //Log balance after
          // console.log("deployer balance after transfer", toReadableValue(await token.balanceOf(deployer.address)))
          // console.log("reciver balance after transfer", toReadableValue(await token.balanceOf(reciver.address)))
        })
        it('emits a Transfer event', async ()=>{
          expect(event.fragment.name).to.equal('Transfer')
          expect(args[0]).to.equal(deployer.address)
          expect(args[1]).to.equal(reciver.address)
          expect(args[2]).to.equal(amount)
        })  
  
      })

      describe("Failure", ()=>{
        it('rejects insufficient balances', async ()=>{
          const invalidAmount=tokens(10000000)
          await expect(token.connect(deployer).transfer(reciver, invalidAmount)).to.be.reverted
                  
         })
         it('invalid recipient', async ()=>{
          const amount=tokens(100)
          await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
                  
         })
         it('invalid amount', async ()=>{
          const amount=tokens(0)
          await expect(token.connect(deployer).transfer(reciver, amount)).to.be.reverted
                  
         })
      })

    })

    describe ('Approving Tokens', ()=>{
      let amount, transaction, result, event, args
      
        beforeEach(async ()=>{
          amount = tokens(100);
          transaction = await token.connect(deployer).approve(exchange.address, amount)
          result = await transaction.wait()    
          
          filter = token.filters.Approval
          const events = await token.queryFilter(filter, -1)
         
          event = events[0]
          args = event.args
        })
      
      describe("Sussess", ()=>{
        it('allocates an allowance for delegated token spending', async ()=>{
          expect (await token.allowance(deployer.address, exchange.address)).to.equal(amount)
        })
        it('emits an Approve event', async ()=>{
          expect(event.fragment.name).to.equal('Approval')
          expect(args[0]).to.equal(deployer.address)
          expect(args[1]).to.equal(exchange.address)
          expect(args[2]).to.equal(amount)
        })  
      })
      describe("Failure", ()=>{
        it('rejects invalid spenders', async () => {
          await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000',amount)).to.be.reverted
        })

      })
    })
   
    describe ('Delegated Token Transfers', ()=>{
      let amount, biggerAmount, invalidAmount, transaction, result, event, args
        this.beforeEach(async ()=>{
          amount = tokens(100);
          
          transaction = await token.connect(deployer).approve(exchange.address, amount)
          result = await transaction.wait()    
          
          // filter = token.filters.Approval
          // const events = await token.queryFilter(filter, -1)
         
          // event = events[0]
          // args = event.args
        })

        describe("Success", ()=>{
          beforeEach(async ()=>{
            transaction = await token.connect(exchange).transferFrom(deployer.address, reciver.address, amount)
            result = await transaction.wait()    
            
            // filter = 
            const events = await token.queryFilter(token.filters.Transfer, -1)           
            event = events[0]
            args = event.args
          })
          
          it('transfers token balances', async () => {
            expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
            expect(await token.balanceOf(reciver.address)).to.equal(amount)
          })
          
          it('reset the allowance', async ()=>{
            expect(await token.allowance(deployer.address,exchange.address)).to.be.equal(0)
          })
          
          it('emits a Transfer event', async ()=>{
            expect(event.fragment.name).to.equal('Transfer')
            expect(args[0]).to.equal(deployer.address)
            expect(args[1]).to.equal(reciver.address)
            expect(args[2]).to.equal(amount)
          })  
          
        })

        describe("Failure", ()=>{
          beforeEach(async ()=>{
            biggerAmount= tokens(101);
            invalidAmount= tokens(10000000);
          })
        
          it('spends more then allowed', async()=>{             
            await expect(token.connect(exchange).transferFrom(deployer.address, reciver.address, biggerAmount)).to.be.reverted
          })
          it('spends more then what he has', async()=>{
            transaction = await token.connect(deployer).approve(exchange.address, invalidAmount)
            result = await transaction.wait()    
           
            await expect(token.connect(exchange).transferFrom(deployer.address, reciver.address, invalidAmount)).to.be.reverted
          })
           
          // it('rejects invalid spenders', async () => {
          //   // await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
          // })
  
        })
    })
});
