const hre = require("hardhat");
const { ethers, network } = require("hardhat");

module.exports = async () => {
  const Library = await ethers.getContractFactory("Library");
  const library = await Library.deploy();
  await library.deployed();
  const deployer = await library.owner();

  console.log("Library deployed at: " + library.address);
  await hre.run("deployment-details", {
    contractAddress: library.address,
    networkName: network.name,
    deployer: deployer,
  });
};
