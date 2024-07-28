const { BASEURL } = require('./managers/index.js');
const { saveString, getString } = require('./stringStore');
const axios = require('axios');

const init = async function(ERLC_API_KEY) {
    // Checking if the API key is valid
    const endpoint = 'server';
    const apikeyresponse = axios.get(`${BASEURL}${endpoint}`, {
        headers: { 'Server-Key': process.env.ERLCAPIKEY }
    });

    if (!apikeyresponse.response.json().Name) throw new Error('Invalid API key provided');

    // Main init
    saveString(ERLC_API_KEY)
}

module.exports = {
    init
}