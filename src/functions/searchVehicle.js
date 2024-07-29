const { BASEURL } = require('../managers/index.js');
const { getString } = require('../managers/stringStore.js');
const axios = require('axios');
const path = require('path');
const { DEBUG } = require('../../dist/managers/debugManager.js');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const createError = (code, message, note = '') => ({
    error: {
        code,
        message,
        note,
        author: path.basename(__filename, '.js') + '()'
    }
});

const handleApiError = (err) => {
    if (err === '404') {
        return createError(404, 'Vehicle not found', "The vehicle couldn't be found!");
    }
    if (err.message === 'Request timed out') {
        return createError(444, 'No Response', "This is usually because your API key is invalid and a response wasn't available");
    }
    if (err.response && err.response.status === 429) {
        return createError(429, 'You are being rate limited!');
    }
    ErlcConsole.error(err.message);
    return createError(500, 'Internal Server Error', err.message);
};

const debugLog = (message) => {
    if (DEBUG() === true) {
        ErlcConsole.log(`[DEBUG] ${message}`);
    }
};

const fetchApiData = async (endpoint) => {
    try {
        debugLog(`Fetching data from endpoint: ${endpoint}`);
        const response = await axios.get(`${BASEURL}${endpoint}`, {
            headers: { 'Server-Key': getString() }
        });
        debugLog(`Response received: ${JSON.stringify(response.data)}`);
        return response;
    } catch (error) {
        debugLog(`Error fetching data: ${error.message}`);
        throw error;
    }
};

module.exports = async function (string) {
    while (await getString() === null) {
        debugLog('Waiting for valid API key...');
        await sleep(100);
    }

    const LookupString = string.toLowerCase();
    debugLog(`LookupString: ${LookupString}`);

    const timeout = ms => new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));

    try {
        debugLog('Starting API request with timeout');
        const response = await Promise.race([
            fetchApiData('server/players'),
            timeout(5000)
        ]);

        debugLog('Processing response data');
        const result = response.data.find(element => {
            try {
                const Owner = element.Owner;

                debugLog(`Checking element: VehicleOwner=${Owner}`);

                return Owner === string;
            } catch (err) {
                debugLog(`Error processing element: ${err.message}`);
                handleApiError('404 \n\nRaw:' + err);
                return null;
            }
        });

        if (result) {
            const Texture = result.Texture;
            const Name = result.Name;
            const Owner = result.Owner;

            debugLog(`Checking element: VehicleOwner=${Owner}, VehicleName=${Name}, Texture=${Texture}`);
            return { response: { code: 200 }, data: { Texture, Name, Owner } };
        } else {
            debugLog('No result found');
            return handleApiError('404');
        }

    } catch (err) {
        debugLog(`Caught error: ${err.message}`);
        return handleApiError(err);
    }
};