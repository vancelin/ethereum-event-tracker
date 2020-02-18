'use strict';

const configs = require('./configs/default');
const model = require('./model');
const { query } = require('./libs/database');
const errorMessage = require('./utils/error');
const Bull = require('bull');
const Web3 = require('web3');
const transactionHashQueue = new Bull('transactionHash', configs.redisQueueConnection);

async function eventTracker() {

	try {

		let fromBlock = 0;
		let toBlock = await getLatestBlock();
		let { earliestBlock, latestBlock } = await getBlockNumberFromDB();

		if (earliestBlock === null || latestBlock === null) {
			earliestBlock = configs.eth.earliestBlock;
			fromBlock = configs.eth.earliestBlock;
		} else {
			fromBlock = latestBlock;
		}

		if (fromBlock >= toBlock) {
			return;
		}

		await getPastEvents(fromBlock, toBlock);
		await model.updateBlockNumber({earliestBlock: earliestBlock, latestBlock: toBlock});
		enqueueTasks();

		console.log('********************** Done **********************');

	} catch (err) {
		errorMessage.routerSend('EventTracker', err);
		throw(err);
	}

}

async function getBlockNumberFromDB() {
	try {
		const { earliest, latest } = await model.getBlockInfo();
		return {
			earliestBlock: earliest,
			latestBlock: latest
		}
	} catch (err) {
		errorMessage.routerSend('getBlockNumberFromDB', err);
		throw(err);
	}
}

async function getLatestBlock() {
	try {
		const web3 = new Web3(configs.eth.web3EndPoint);
		return await web3.eth.getBlockNumber();
	} catch (err) {
		errorMessage.routerSend('getLatestBlock', err);
		throw(err);
	}
}

async function getPastEvents(fromBlock, toBlock) {

	console.log('fromBlock', fromBlock);
	console.log('toBlock', toBlock);

	const web3 = new Web3(configs.eth.web3EndPoint);
	const contract = new web3.eth.Contract(configs.eth.contractAbi, configs.eth.contractAddress);

	try {
		let events = await contract.getPastEvents("allEvents", {
      fromBlock: fromBlock,
      toBlock: toBlock,
      filter: {
      	_to: walletAddressesToCheckSum(configs.eth.walletAddresses)
      }
    });

		await Promise.all(events.map(async function(e) {
			const insertObj = {
				transaction_hash: e.transactionHash,
				from_address: e.returnValues._from,
				to_address: e.returnValues._to,
				blocknumber: e.blockNumber
			}

			// use "insert ignore" to prevent the duplicate key
			try {
				await insertRecordToDB(insertObj);
			} catch (err) {
				errorMessage.routerSend('getPastEvents', err);
				throw(err);
			}
		}));
	} catch (err) {
		errorMessage.routerSend('getPastEvents', err);
		throw(err);
	}

}

async function insertRecordToDB(insertObj) {
	try {
		await model.insertRecordToDB(insertObj);
	} catch (err) {
		errorMessage.routerSend('insertRecordToDB', err);
		throw(err);
	}
}

async function updateRecordToDB(updateObj, blockInfo) {
	try {
		await model.updateRecordToDB(updateObj);
	} catch (err) {
		errorMessage.routerSend('updateRecordToDB', err);
		throw(err);
	}
}

function walletAddressesToCheckSum(walletAddresses) {
	const web3 = new Web3(configs.eth.web3EndPoint);
	let addresses = [];

	for (const i in walletAddresses) {
		addresses.push(web3.utils.toChecksumAddress(walletAddresses[i]));
	}

	return addresses;
}

async function enqueueTasks() {

	try {

		// transactionHashQueue.clean(5000);

		const allTransactionHashs = await model.getAllTransactionHashs(0);

		// console.log('allTransactionHashs', allTransactionHashs);

		await Promise.all(allTransactionHashs.map(async t => {
			await transactionHashQueue.add('__default__', t, {jobId: t.transaction_hash });
		}));

		// console.log('jobList before processing', await transactionHashQueue.getJobs());

		// await processQueue();

	} catch (err) {
		errorMessage.routerSend('enqueueTasks', err);
		throw(err);
	}
}

module.exports = eventTracker;