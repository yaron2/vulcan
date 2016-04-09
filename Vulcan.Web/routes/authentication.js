var express = require('express');
var router = express.Router();
var config = require('../config.js').config();
var jwt = require('jwt-simple');
var User = require('../schemas/user.js');

router.post('/login', function (req, res) {
    if (!req.body) {
        res.json({ status: 'error', errorMessage: 'Body cannot be empty' });
        return;
    }
    
    var email = req.body.email;
    var password = req.body.password;
    
    User.findOne({ 'email': email, 'password': password }, function (error, user) {
        if (error || !user) {
            res.status(401).send();
            return;
        }
        
        var token = jwt.encode(user._id, config.secret);
        
        user.token = token;
        user.save(function (error, user) {
            if (!error) {
                res.json({ status: 'ok', token: token });
            }
            else
                res.json({ status: 'error', errorMessage: 'Login failed' });
        });
    });
});

router.post('/register', function (req, res) {
    console.log('register');
    if (!req.body) {
        res.json({ status: 'error', errorMessage: 'Body cannot be empty' });
        return;
    }
    
    User.findOne({ 'email': req.body.email }, function (err, model) {
        if (model) {
            res.json({ status: 'error', errorMessage: 'Email already registered' });
            return;
        }
        
        var user = new User(req.body);
        user.save(function (error, model) {
            if (!error) {
                res.json({ status: 'ok' });
            }
            else {
                res.json({ status: 'error', errorMessage: 'failed creating user' });
            }
        });
    });
});

module.exports = router;