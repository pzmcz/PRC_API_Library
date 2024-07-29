const { BASEURL } = require('../managers/index.js');
const { getString } = require('../managers/stringStore.js');
const axios = require('axios');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function fetchApiData(endpoint) {
    return axios.get(`${BASEURL}${endpoint}`, {
        headers: { 'Server-Key': getString() }
    });
};

module.exports = async function () {
    while (await getString() === null) await sleep(100);

    try {
        const out = JSON.parse(fetchApiData('server').data);
        return out;
    } catch (err) {
        if (err.message === '"undefined" is not valid JSON') {
            return { error: { code: 204, message: 'The server is currently closed!', author: require('path').basename(__filename, '.js') + '()' } }
        } else if (err.response.status === 429) {
            return { error: { code: 429, message: 'You are being rate limited!', author: require('path').basename(__filename, '.js') + '()' } };
        } else {
            console.log(err.message);
        }
    }
};