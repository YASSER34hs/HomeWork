const express = require('express');
const router = express.Router();
const fs = require('fs');
const { users, weakHash } = require('../database');


const candidates = fs.readFileSync('./candidates.txt', 'utf-8').split('\n');

router.get('/', (req, res) => {
    res.render('brute', { 
        userCredentials: "apvgn:yqtbh",
        victimUsername: "frqkp",
        candidates: candidates.join(', ')
    });
});

router.post('/', (req, res) => {
    const { cookie } = req.body;
    if (!cookie) return res.send('No cookie provided');
    
    const [username, hash] = cookie.split(':');
    const user = users.find(u => u.username === username);
    
    if (!user) return res.send('User not found');
    
    let found = false;
    for (const candidate of candidates) {
        const testHash = weakHash(username + ':' + candidate.trim());
        if (testHash === hash) {
            found = true;
            return res.send(`
                <h1>Success!</h1>
                <p>Token found: ${candidate}</p>
                <p>Now you can login as ${username} by setting the cookie manually</p>
                <a href="/">Return to home</a>
            `);
        }
    }
    
    res.send(`
        <h1>Brute Force Failed</h1>
        <p>Try with a better wordlist</p>
        <a href="/brute">Try again</a>
    `);
});

module.exports = router;