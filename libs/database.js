'use strict';

const mysql = require('mysql2');
const moment = require('moment');
const NP = require('number-precision');
const configs = require('../configs/default')
const pool = mysql.createPool(configs.mysql);

exports.query = (command, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      //log all query
      /*connection.on('enqueue', function (sequence) {
        if ('Query' === sequence.constructor.name) {
          console.log(sequence.sql);
        }
      });*/
      if (err) {
        reject(err);
      } else {
        connection.query(command, values, (err, rows, fields) => {
          if (err) {
            reject(err);
          } else {
            let obj = {};
            obj.data = rows;
            resolve(obj);
          };
        });
      };
      pool.releaseConnection(connection);
    });
  });
};