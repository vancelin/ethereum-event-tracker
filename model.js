'use strict';

const { query } = require('./libs/database');
const moment = require('moment');
const errorMessage = require('./utils/error');

exports.getBlockInfo = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const _sql = "SELECT * FROM blocknumber LIMIT 1";
      const selectResult = await query(_sql, []);
      // console.log('selectResult', selectResult);
      const resultObj = {};

      if (selectResult.data.length === 0) {
        resultObj.earliest = null;
        resultObj.latest = null;
      } else {
        resultObj.earliest = selectResult.data[0].earliest;
        resultObj.latest = selectResult.data[0].latest;
      }
      resolve(resultObj);
    } catch (e) {
      const errObj = errorMessage.modelSend("getBlockInfo", e);
      reject(errObj);
    };
  });
};

exports.insertRecordToDB = (insertObj) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { transaction_hash, from_address, to_address, blocknumber } = insertObj;
      const _sql = "INSERT IGNORE INTO transfer_history(transaction_hash, from_address, to_address, blocknumber) VALUES(?, ?, ?, ?)";
      const insertResult = await query(_sql, [transaction_hash, from_address, to_address, blocknumber]);
      // resolve(insertResult.data.affectedRows);
      resolve(true);
    } catch (e) {
      const errObj = errorMessage.modelSend("insertRecordToDB", e);
      reject(errObj);
    };
  });
};

exports.updateRecordToDB = (opdateObj) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { transaction_hash, status } = opdateObj;
      console.log('transaction_hash', transaction_hash);
      console.log('status', status);
      const _sql = "UPDATE transfer_history SET status = ? WHERE transaction_hash = ?";
      const result = await query(_sql, [status, transaction_hash]);
      let isDone = false;
      (result.data.affectedRows === 1) ? isDone = true : isDone = false;
      resolve(true);
    } catch (e) {
      const errObj = errorMessage.modelSend("updateRecordToDB", e);
      reject(errObj);
    };
  });
};

exports.updateBlockNumber = (blockInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { earliestBlock, latestBlock } = blockInfo;
      // console.log('earliestBlock', earliestBlock);
      // console.log('latestBlock', latestBlock);
      const _sql = "REPLACE INTO blocknumber(id, earliest, latest) VALUES (1, ?, ?);"
      const result = await query(_sql, [earliestBlock, latestBlock]);
      // let isDone = false;
      // (result.data.affectedRows === 1) ? isDone = true : isDone = false;
      resolve(true);
    } catch (e) {
      const errObj = errorMessage.modelSend("updateBlockNumber", e);
      reject(errObj);
    };
  });
};

exports.getAllTransactionHashs = (status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const _sql = "SELECT transaction_hash FROM transfer_history WHERE `status` = ?";
      const selectResult = await query(_sql, [status]);
      resolve(selectResult.data);
    } catch (e) {
      const errObj = errorMessage.modelSend("getAllTransactionHashs", e);
      reject(errObj);
    };
  });
};
