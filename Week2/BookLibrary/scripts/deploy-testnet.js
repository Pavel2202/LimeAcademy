const { ethers } = require("hardhat");

module.exports = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.SEPOLIA_RPC_URL
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const Library = await ethers.getContractFactory("Library", wallet);
  const library = await Library.deploy();
  await library.deployed();

  console.log("Library deployed at: " + library.address);
};
