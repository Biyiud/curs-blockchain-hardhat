/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-ethers"); // Required for using ethers.js with Hardhat

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 5, // Generate only 5 accounts
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
  },
};
