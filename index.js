'use strict';

const configs = require('./configs/default');
const eventTracker = require('./EventTracker');

setInterval(() => eventTracker(), configs.pollingTime);