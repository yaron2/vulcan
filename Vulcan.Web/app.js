var express = require('express');
var path = __dirname + '/site/';
var bodyParser = require('body-parser');
var config = require('./config.js').config();
var jwt = require('jwt-simple');
var cors = require('cors');
var mongoose = require('mongoose');
var app = express();
var router = express.Router();
var queryApi = require('./routes/query.api.js');
var databasesApi = require('./routes/databases.api.js');
var auth = require('./routes/authentication.js');
var users = require('./routes/users.js');

mongoose.connect(config.db);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', function (req, res) {
    res.sendFile(path + "index.html");
});

app.use('/', router);
app.use('/auth', auth);
app.use(express.static(path));

app.use(function (req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
        res.status(200).send();
        return;
    }
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    // decode token
    if (token) {
        // verifies secret and checks exp
        var decoded = jwt.decode(token, config.secret);
        if (decoded) {
            req.token = decoded;
            next();
        }
        else {
            res.json({ status: 'error', errorMessage: 'Failed to authenticate token' });
            return;
        }
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            status: 'error', 
            errorMessage: 'No token provided.'
        });  
    }
});

app.use('/users', users);
app.use('/api/query', queryApi);
app.use('/api/databases', databasesApi);

var port = 4000;
app.listen(port);

module.exports = app;
