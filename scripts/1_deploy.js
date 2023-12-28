// const hre = require("hardhat");
//npx hardhat run --network localhost scripts/1_deploy.js
const name = "Zilpio Token Test"
const symbol = "ZPTt"
const totalSupply = 1000000

async function main() {
  console.log("Preparing deployment...\n")
    //Fetch contract to deploy
    const Token = await ethers.getContractFactory('Token');
    const Exchange = await ethers.getContractFactory('Exchange');
    
    //Fetch accounts
    const accounts = await ethers.getSigners()
    console.log(`Account fetched:\n ${accounts[0].address}\n${accounts[1].address}\n`)
   
    //Deploy Token1
     const token1 = await Token.deploy(name, symbol, totalSupply)
     const token2 = await Token.deploy("Mock DAI", "mDai", totalSupply)
     const token3 = await Token.deploy("mEth", "mETH", totalSupply)
     const token4 = await Token.deploy("mDAI", "mDAI", totalSupply)
    //  const zilpioToken = await Token.deploy()   
     await token1.deployed  
     let address1 = await token1.getAddress()

     await token2.deployed 
     let address2 = await token2.getAddress()

     await token3.deployed 
     let address3 = await token3.getAddress()

     await token4.deployed 
     let address4 = await token4.getAddress()


     console.log(`Token1 Deployed to: ${address1}`)
     console.log(`Token2 Deployed to: ${address2}`)
     console.log(`Token3 Deployed to: ${address3}`)
     console.log(`Token4 Deployed to: ${address4}`)

    //Deploy Token2
    
    const exchange = await Exchange.deploy(accounts[1].address,10)
    await exchange.deployed
    console.log(`Exchange Deployed to: ${await exchange.getAddress()}`)
        
 
    

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
