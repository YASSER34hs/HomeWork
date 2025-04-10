const express = require('express');
const router = express.Router();
const { users, generateWeakToken, weakHash } = require('../database');

// الصفحة الرئيسية
router.get('/', (req, res) => {
    res.render('home', { 
        user: req.session.user,
        labTitle: "Lab 9: Brute-forcing a stay-logged-in cookie",
        labDescription: "This lab allows users to stay logged in even after they close their browser session. The cookie used to provide this functionality is vulnerable to brute-forcing."
    });
});

// صفحة الدخول
router.get('/login', (req, res) => {
    res.render('login');
});

// معالجة الدخول
router.post('/login', (req, res) => {
    const { username, password, stayLoggedIn } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).send('Invalid credentials');
    }
    
    if (stayLoggedIn) {
        const token = generateWeakToken();
        user.stayLoggedInToken = token;
        const cookieValue = `${username}:${weakHash(username + ':' + token)}`;
        res.cookie('stay_logged_in', cookieValue, { 
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });
    }
    
    req.session.user = user;
    res.redirect('/account');
});

// صفحة الحساب
router.get('/account', (req, res) => {
    if (req.session.user) {
        return res.render('account', { user: req.session.user });
    }
    
    const cookie = req.cookies.stay_logged_in;
    if (cookie) {
        const [username, hash] = cookie.split(':');
        const user = users.find(u => u.username === username);
        
        if (user && user.stayLoggedInToken) {
            const expectedHash = weakHash(username + ':' + user.stayLoggedInToken);
            if (hash === expectedHash) {
                req.session.user = user;
                return res.render('account', { user });
            }
        }
    }
    
    res.redirect('/login');
});

// تسجيل الخروج
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('stay_logged_in');
    res.redirect('/');
});

module.exports = router;