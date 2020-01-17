'use strict';

const configs = require('./configs/default');
const eventTracker = require('./eventTracker');
const processQueue = require('./processQueue');

setInterval(() => eventTracker(), configs.pollingTime);
processQueue();