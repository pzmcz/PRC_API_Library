const { BASEURL } = require('../managers/index.js');
const { getString } = require('../managers/stringStore.js');
const axios = require('axios');
const path = require('path');
const { DEBUG } = require('../../dist/managers/debugManager.js');
const ErlcConsole = require('../console/console-wrapper.js');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const createError = (code, message, note = '') => ({
    error: {
        code,
        message,
        note,
        author: path.basename(__filename, '.js') + '()'
    }
});

const handleApiResponse = async (response) => {
    debugLog('Handling API response...');
    try {
        const data = response.data;
        debugLog(`Received data: ${JSON.stringify(data)}`);
        return { response: { code: 200 }, data };
    } catch (error) {
        debugLog(`Error while handling API response: ${error.message}`);
        throw error;
    }
};

const debugLog = (message) => {
    if (DEBUG() === true) {
        ErlcConsole.log(`[DEBUG] ${message}`);
    }
};

const handleApiError = (err) => {
    debugLog('Handling API error...');
    if (err.message === 'Request timed out') {
        debugLog('Error: Request timed out');
        return createError(444, 'No Response', "This is usually because your API key is invalid and a response wasn't available");
    }
    if (err.response && err.response.status === 429) {
        debugLog('Error: Rate limit exceeded');
        return createError(429, 'You are being rate limited!');
    }
    debugLog(`Error message: ${err.message}`);
    ErlcConsole.error(err.message);
    return createError(500, 'Internal Server Error');
};

const fetchApiData = async (endpoint) => {
    debugLog(`Fetching API data from endpoint: ${endpoint}`);
    try {
        const response = await axios.get(`${BASEURL}${endpoint}`, {
            headers: { 'Server-Key': getString() }
        });
        debugLog(`API response status: ${response.status}`);
        return response;
    } catch (err) {
        debugLog(`Error fetching API data: ${err.message}`);
        throw err;
    }
};

module.exports = async function () {
    debugLog('Module function started');
    while (await getString() === null) {
        debugLog('Waiting for server key to be available...');
        await sleep(100);
    }

    const timeout = ms => new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));
    
    try {
        debugLog('Starting API request with timeout');
        const response = await Promise.race([
            fetchApiData('server/joinlogs'),
            timeout(5000)
        ]);
        debugLog('API request completed successfully');
        return handleApiResponse(response);
    } catch (err) {
        debugLog('API request failed');
        return handleApiError(err);
    }
};