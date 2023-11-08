require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: "7545",
      network_id: "*",
    },
  },
  contracts_directory: "./src/contracts",
  contracts_build_directory: "./src/truffle_abis",
  compilers: {
    solc: {
      version: "^0.5.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
}

//sepolia 설정방법
/*require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = "theory reject soda wealth frequent test solve ceiling april infant table liberty";
const infura_sepolia_endpoint = "https://sepolia.infura.io/v3/3f5de63cfb0f494282293b204bb18f61";
module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(mnemonic, infura_sepolia_endpoint, 0, 2),
      network_id: "11155111",
      gas: 3000000, // 이 값을 낮추면 가스 비용을 줄일 수 있습니다.
      gasPrice: 20000000000
    },
  },
  contracts_directory: "./src/contracts",
  contracts_build_directory: "./src/truffle_abis",
  compilers: {
    solc: {
      version: "^0.5.0",
      "optimizer": {
        "enabled": true,
        "runs": 200
      },
      "outputSelection": {
        "*": {
          "*": [
            "evm.bytecode",
            "evm.deployedBytecode",
            "devdoc",
            "userdoc",
            "metadata",
            "abi"
          ]
        },
      },
    },
  },
  plugins: ['truffle-flatten']

};*/