'use strict';

const configs = require('./configs/default');
const model = require('./model');
const { query } = require('./libs/database');
const errorMessage = require('./utils/error');
const Bull = require('bull');
const Web3 = require('web3');
const transactionHashQueue = new Bull('transactionHash', configs.redisQueueConnection);

async function processQueue() {

	const web3 = new Web3(configs.eth.web3EndPoint);

	try {

		transactionHashQueue.process(async function(job, done) {
			// console.log(job);
			const transactionReceipt = await web3.eth.getTransactionReceipt(job.data.transaction_hash);
			// console.log('transactionReceipt', transactionReceipt);
			if (transactionReceipt.status) {
				console.log('checked the transaction receipt', job.data.transaction_hash);
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

module.exports = processQueue;