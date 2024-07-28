const { BASEURL } = require('../managers/index.js');
const { getString } = require('../managers/stringStore.js');
const axios = require('axios');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async function() {
    let result;
    while ((result = await getString()) === '') await sleep(100);
    console.log("hi", result);
};
