'use strict';

const infuraKey = '';

module.exports = {
	eth: {
		//web3Url: 'https://api.mycryptoapi.com/eth',
		// web3Url: 'https://mew.giveth.io/',
		// web3Url: 'https://free-white-lingering-feather.quiknode.pro/baa56bcf1860f96cbd83dc5810f6d65fa58e2550/',
		web3Url: 'wss://mainnet.infura.io/ws/v3/' + infuraKey,
		contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
		walletAddresses: ['0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa'],
		contractAbi: [{"constant": true,"inputs": [],"name": "name","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_spender","type": "address"},{"name": "_value","type": "uint256"}],"name": "approve","outputs": [{"name": "_success","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "totalSupply","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_from","type": "address"},{"name": "_to","type": "address"},{"name": "_value","type": "uint256"}],"name": "transferFrom","outputs": [{"name": "_success","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "decimals","outputs": [{"name": "","type": "uint8"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "balanceOf","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "symbol","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_to","type": "address"},{"name": "_value","type": "uint256"}],"name": "transfer","outputs": [{"name": "_success","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "_spender","type": "address"},{"name": "_value","type": "uint256"},{"name": "_data","type": "bytes"}],"name": "approveAndCall","outputs": [{"name": "_success","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"},{"name": "","type": "address"}],"name": "allowance","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"inputs": [{"name": "_operator","type": "address"}],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"name": "_from","type": "address"},{"indexed": true,"name": "_to","type": "address"},{"indexed": false,"name": "_value","type": "uint256"}],"name": "Transfer","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "_owner","type": "address"},{"indexed": true,"name": "_spender","type": "address"},{"indexed": false,"name": "_value","type": "uint256"}],"name": "Approval","type": "event"}],
		earliestBlock: 9225247
	},
	pollingTime: 5000, // 5 sec
	redisQueueConnection: 'redis://127.0.0.1:6379',
	mysql: {
		host: '127.0.0.1',
	  port: 3306,
	  user: 'root',
	  password: 'password',
	  database: 'database',
	  waitForConnections: true,
	  connectionLimit: 50,
	  queueLimit: 5000,
	  charset: 'utf8mb4'
	}
}