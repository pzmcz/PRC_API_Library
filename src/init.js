const { BASEURL } = require('./managers/index.js');
const { saveString } = require('./managers/stringStore.js');
const axios = require('axios');
const { saveDebugStatus, DEBUG } = require('../dist/managers/debugManager.js');

const debugLog = (message) => {
    if (DEBUG() === true) {
        console.log(`[DEBUG] ${message}`);
    }
};

const init = async function (apiKey, v) {
    try {
        await (saveDebugStatus(v ? true : false));
        debugLog('Found init.js module');
        console.log('Validating API key...');
        const endpoint = 'server';
        debugLog('Running PRC.API server endpoint request');
        await axios.get(`${BASEURL}${endpoint}`, {
            headers: { 'Server-Key': apiKey }
        });
        debugLog('Running modules');

        console.log('Saving API key to run data');
        debugLog('Saving API key for local use');
        await saveString(apiKey);
        console.log('Successfully launched ERLC-API manager');
        debugLog('No errors found whilst loading');
        debugLog('Saved global debug status');
        debugLog('Logged into PRC api');
        debugLog('Ready for use!');
    } catch (error) {
        if (error.message.includes('Request failed with status code 403')) { return console.log('Invalid API key provided') }
        console.error(error.message);
    }
};

const getBanLogs = require('./functions/getBanLogs.js');
const getCommandLogs = require('./functions/getCommandLogs.js');
const getJoinLogs = require('./functions/getJoinLogs.js');
const getKillLogs = require('./functions/getKillLogs.js');
const getModCallLogs = require('./functions/getModCallLogs.js');
const getPlayers = require('./functions/getPlayers.js');
const getPlayersInQueue = require('./functions/getPlayersInQueue.js');
const getServerInformation = require('./functions/getServerInformation.js');
const getVehicles = require('./functions/getVehicles.js');
const help = require('./functions/help.js');
const searchPlayer = require('./functions/searchPlayer.js');
const searchVehicle = require('./functions/searchVehicle.js');

module.exports = {
    init,

    // functionality
    getBanLogs,
    getCommandLogs,
    getJoinLogs,
    getKillLogs,
    getModCallLogs,
    getPlayers,
    getPlayersInQueue,
    getServerInformation,
    getVehicles,
    help,
    searchPlayer,
    searchVehicle
};