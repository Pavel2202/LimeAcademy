const { task, subtask } = require("hardhat/config");

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const MNEMONIC = process.env.MNEMONIC;
const PASS_PHRASE = process.env.PASS_PHRASE;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const ETHERSCAN_API = process.env.ETHERSCAN_API;

const lazyImport = async (module) => {
  return await require(module);
};

task("deploy", "Deploys contracts").setAction(async () => {
  const main = await lazyImport("./scripts/deploy.js");
  await main();
});

task("deploy-testnet", "Deploys contracts on testnet").setAction(async () => {
  const main = await lazyImport("./scripts/deploy-testnet.js");
  await main();
});

subtask("deployment-details", "Prints deployment details")
  .addParam("contractAddress", "Contract's address")
  .addParam("networkName", "The network the contract is deployed on")
  .addParam("deployer", "Deployer's address")
  .setAction(async ({ contractAddress, networkName, deployer }) => {
    console.log(
      `Library deployed ${contractAddress} on ${networkName} by ${deployer}`
    );
  });

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      chainId: 11155111,
      url: SEPOLIA_RPC_URL,
      blockConfirmations: 6,
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: PASS_PHRASE,
      },
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API,
  },
  solidity: "0.8.18",
};
