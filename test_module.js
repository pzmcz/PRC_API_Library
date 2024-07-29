const erlcapi = require('./index.js');
erlcapi.init('twlPObDEJz-qMnRZJeBwzxiMVQACVJIANZXcGQkSSXwQNGsbkEe');
erlcapi.help();
setTimeout(async () => {
    try {
        const response = await erlcapi.getPlayers();

        if (response.error && response.error.code === 204) {
            console.log('The server is currently closed!');
        } else {
            console.log('Response:', response);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}, 4500);