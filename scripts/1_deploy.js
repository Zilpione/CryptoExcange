// const hre = require("hardhat");

async function main() {
    //Fetch contract to deploy
    const Token = await ethers.getContractFactory("Token");
    // const Token = await hre.ethers.deployContract();
  
    //Deploy contract
    const token = await Token.deploy()
    // await lock.waitForDeployment();


    console.log(token.deployed)
    let address = await token.getAddress()
    console.log(`Token Deployed to: ${address}`)
    

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
