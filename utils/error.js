'use strict';

const errConfig = require('../configs/error.json');

function errFormat(err) {
  if (typeof (err) === 'string') {
    return `${err}`;
  }
  else if (err instanceof Error && err.hasOwnProperty('message')) {
    return err.message;
  }
  else {
    return err;
  }
}


/**
 * 參數檢查層錯誤
 * @param {string} errType error type
 * @param {any} error error object
 *
 * @return {{object}} errObj
 */
exports.reqCheckSend = (errType, err) => {
  try {
    let errObj = {};
    errObj = errConfig.paramCheck[errType];
    console.log('errType', errType)
    const errResult = errFormat(err);
    errObj.errorDetail = errResult;
    return errObj;
  }
  catch (e) {
    console.error('參數檢查層 發生錯誤', e);
  }
}
/**
 * 模組發生錯誤
 * @param {string} errType error type
 * @param {any} error error object
 *
 * @return {{object}} errObj
 */
exports.moduleSend = (errType, err) => {
  try {
    console.error(err);
    let errObj = {};
    errObj = errConfig.module[errType];
    const errResult = errFormat(err);
    errObj.errorDetail = errResult;
    return errObj;
  }
  catch (e) {
    console.error('模組發生錯誤', e);
  }
}
/**
 * 商業邏輯層發生錯誤
 * @param {string} errType error type
 * @param {any} error error object
 *
 * @return {{object}} errObj
 */
exports.serviceSend = (errType, err) => {
  try {
    console.error(err);
    let errObj = {};
    errObj = errConfig.service[errType];
    const errResult = errFormat(err);
    errObj.errorDetail = errResult;
    return errObj;
  }
  catch (e) {
    console.error('商業邏輯層 發生錯誤', e);
  }
}
/**
 * Router層發生錯誤
 * @param {string} errType error type
 * @param {any} error error object
 *
 * @return {{object}} errObj
 */
exports.routerSend = (errType, err) => {
  try {
    console.error(err);
    let errObj = {};
    errObj = errConfig.router[errType];
    const errResult = errFormat(err);
    errObj.errorDetail = errResult;
    return errObj;
  }
  catch (e) {
    console.error('Router層 發生錯誤', e);
  }
}
/**
 * Model層發生錯誤
 * @param {string} errType error type
 * @param {any} error error object
 *
 * @return {{object}} errObj
 */
exports.modelSend = (errType, err) => {
  try {
    console.log(err instanceof Error)
    console.error(err);
    let errObj = {};
    errObj = errConfig.model[errType];
    const errResult = errFormat(err);
    errObj.errorDetail = errResult;
    return errObj;
  }
  catch (e) {
    console.error('Model層 發生錯誤', e);
  }
}

