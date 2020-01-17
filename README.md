# Monitor the status of the USDT received by your specified wallet based on Ethereum

## Usage

### 1. setup Mysql & Redis

### 2. import sql file

### 3. install packages

``` npm install ```

### 4. set up the config

```
# revise the configs/default.js

# infuraKey: add infura key
# contractAddress: default setting is monitoring the USDT status, change the contractAddress if you want
# walletAddresses: add wallet address you want to monitor
# earliestBlock: set the block number you want get started

# fill out the redisQueueConnection and Mysql configurations

const infuraKey = ''; // infura Key

module.exports = {
	eth: {
		// web3EndPoint: 'https://api.mycryptoapi.com/eth',
		// web3EndPoint: 'https://mew.giveth.io/',
		// web3EndPoint: 'https://free-white-lingering-feather.quiknode.pro/baa56bcf1860f96cbd83dc5810f6d65fa58e2550/',
		web3EndPoint: 'wss://mainnet.infura.io/ws/v3/' + infuraKey,
		contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
		walletAddresses: ['0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa'],
		contractAbi: ...,
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


```

### 5. start it

``` npm start ```

You can see all transfer events of USDT in the database
