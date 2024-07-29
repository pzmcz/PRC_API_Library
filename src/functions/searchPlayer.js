const { BASEURL } = require('../managers/index.js');
const { getString } = require('../managers/stringStore.js');
const axios = require('axios');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async function () {
    while (await getString() === null) await sleep(100);
    const apiKey = getString();

    const endpoint = 'server/players';
    return (await axios.get(`${BASEURL}${endpoint}`, {
        headers: { 'Server-Key': apiKey }
    }));
};