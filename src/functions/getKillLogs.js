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

const handleApiResponse = async (response) => {
    const data = response.data;
    return { response: { code: 200 }, data };
};

const debugLog = (message) => {
    if (DEBUG() === true) {
        console.log(`[DEBUG] ${message}`);
    }
};

const handleApiError = (err) => {
    if (err.message === 'Request timed out') {
        return createError(444, 'No Response', "This is usually because your API key is invalid and a response wasn't available");
    }
    if (err.response && err.response.status === 429) {
        return createError(429, 'You are being rate limited!');
    }
    console.error(err.message);
    return createError(500, 'Internal Server Error');
};

const fetchApiData = async (endpoint) => {
    const response = await axios.get(`${BASEURL}${endpoint}`, {
        headers: { 'Server-Key': getString() }
    });
    return response;
};

module.exports = async function () {
    while (await getString() === null) await sleep(100);

    const timeout = ms => new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));
    
    try {
        const response = await Promise.race([
            fetchApiData('server/killlogs'),
            timeout(5000)
        ]);
        return handleApiResponse(response);
    } catch (err) {
        return handleApiError(err);
    }
};