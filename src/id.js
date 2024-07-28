const { BASEURL } = require('./managers/index.js');
const { saveString } = require('./managers/stringStore.js');
const axios = require('axios');

const init = async function (apiKey) {
    try {
        console.log('Validating API key...');
        const endpoint = 'server';
        await axios.get(`${BASEURL}${endpoint}`, {
            headers: { 'Server-Key': apiKey }
        });

        console.log('Saving API key to run data');
        await saveString(apiKey);
        console.log('Successfully launched ERLC-API manager');
    } catch (error) {
        if (error.message.includes('Request failed with status code 403')) { return console.log('Invalid API key provided') }
        console.error(error.message);
    }
};

module.exports = {
    init
};