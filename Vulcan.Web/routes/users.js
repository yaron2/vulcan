var express = require('express');
var router = express.Router();
var User = require('../schemas/user.js');

router.get('/', function (req, res) {
    var userId = req.token;
    
    User.findById(userId, 'firstname lastname email token', function (error, user) {
        if (!error && user)
            res.json({ status: 'ok', user: user });
        else
            res.json({ status: 'error', errorMesasge: 'User not found' });
    });
});

module.exports = router;