const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens= (n)=>{
  return ethers.parseUnits(n.toString(), 'ether');
}
// describe("Token", => () {
describe("Token", function  () {
    let token
    const name = "Zilpio Token Test"
    const symbol = "ZPTt"
    const totalSupply = 1000000
    this.beforeEach(async ()=>{
      //Fetch Token
      const Token = await ethers.getContractFactory('Token')
      token = await Token.deploy(name,symbol, totalSupply)
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
    })

    
 
});
