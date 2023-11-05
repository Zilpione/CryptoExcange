const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens= (n)=>{
  return ethers.parseUnits(n.toString(), 'ether');
}
const toReadableValue=(n)=>{
  return ethers.formatUnits(n.toString())
}

// describe("Token", => () {
describe("Exchange", function  () {
   
  let deployer, feeAccount, exchange
  const feePercent = 10
  this.beforeEach(async ()=>{
    
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    feeAccount = accounts[1]

    const Exchange = await ethers.getContractFactory('Exchange')
   
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
});
