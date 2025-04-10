const crypto = require('crypto');

function generateWeakToken() {
    return crypto.randomBytes(4).toString('hex'); 
}


function weakHash(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}


const users = [
    {
        username: 'apvgn',
        password: 'yqtbh', 
        stayLoggedInToken: null
    },
    {
        username: 'frqkp',
        password: 'victim123', 
        stayLoggedInToken: null
    }
];

module.exports = { users, generateWeakToken, weakHash };