'use strict';

const configs = require('./configs/default');
const model = require('./model');
const { query } = require('./libs/database');
const errorMessage = require('./utils/error');
const Bull = require('bull');
const Web3 = require('web3');

async function EventTracker() {

	try {

		let fromBlock = 0;
		let toBlock = await getLatestBlock();
		let { earliestBlock, latestBlock } = await getBlockNumberFromDB();

		if (earliestBlock === null || latestBlock === null) {
			fromBlock = configs.eth.earliestBlock;
		} else {
			fromBlock = latestBlock;
		}

		const events = await getPastEvents(fromBlock, toBlock);

		events.map(async function(e) {
			const insertObj = {
				transaction_hash: e.transactionHash,
				from_address: e.returnValues._from,
				to_address: e.returnValues._to,
				blocknumber: e.blockNumber
			}

			// use "insert ignore" to prevent the duplicate key
			await insertRecordToDB(insertObj);
		});

		await enqueueTasks();

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
		const web3 = new Web3(configs.eth.web3Url);
		return await web3.eth.getBlockNumber();
	} catch (err) {
		errorMessage.routerSend('getLatestBlock', err);
		throw(err);
	}
}

async function getPastEvents(fromBlock, toBlock) {

	// console.log('fromBlock', fromBlock);
	// console.log('toBlock', toBlock);

	const web3 = new Web3(configs.eth.web3Url);
	const contract = new web3.eth.Contract(configs.eth.contractAbi, configs.eth.contractAddress);

	try {
		let events = await contract.getPastEvents("Transfer", {
      fromBlock: fromBlock,
      toBlock: toBlock,
      filter: {
      	_to: walletAddressesToCheckSum(configs.eth.walletAddresses)
      }
    });
    return events;
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

async function updateRecordToDB(updateObj) {
	try {
		await model.updateRecordToDB(updateObj);
	} catch (err) {
		errorMessage.routerSend('updateRecordToDB', err);
		throw(err);
	}
}

function walletAddressesToCheckSum(walletAddresses) {
	const web3 = new Web3(configs.eth.web3Url);
	let addresses = [];
	walletAddresses.map(adr => {
		addresses.push(web3.utils.toChecksumAddress(adr));
	});
	return addresses;
}

async function enqueueTasks() {

	const transactionHashQueue = new Bull('transactionHash', configs.redisQueueConnection);

	try {

		// transactionHashQueue.clean(5000);

		const allTransactionHashs = await model.getAllTransactionHashs(0);

		// console.log('allTransactionHashs', allTransactionHashs);

		allTransactionHashs.map(t => {
			transactionHashQueue.add(t);
		});

		// console.log('jobList before processing', await transactionHashQueue.getJobs());

		await processQueue();

	} catch (err) {
		errorMessage.routerSend('enqueueTasks', err);
		throw(err);
	}
}

async function processQueue() {

	const transactionHashQueue = new Bull('transactionHash', configs.redisQueueConnection);
	const web3 = new Web3(configs.eth.web3Url);

	try {

		transactionHashQueue.process(async function(job, done) {
			// console.log(job);
			const transactionReceipt = await web3.eth.getTransactionReceipt(job.data.transaction_hash);
			console.log('transactionReceipt', transactionReceipt);
			if (transactionReceipt.status) {
				console.log('checked the transaction receipt');
				const updateObj = {
					transaction_hash: job.data.transaction_hash,
					status: 1
				}
				await model.updateRecordToDB(updateObj);
			}
			done();
		});
		// console.log('jobList after processing', await transactionHashQueue.getJobs());
	} catch (err) {
		errorMessage.routerSend('processQueue', err);
		throw(err);
	}
}
// EventTracker();
// processQueue();

module.exports = EventTracker;
