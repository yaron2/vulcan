var express = require('express');
var router = express.Router();
var DB = require('../schemas/database.js');
var Query = require('../schemas/query.js');
var moment = require('moment');
var sql = require('mssql');
var Stopwatch = require('timer-stopwatch');

router.get('/', function (req, res) {
    res.status(200).send('Vulcan API. status: Running. Version: 0.2');
});

function saveQuery(queryText, userId) {
    var query = new Query();
    query.userId = userId;
    query.text = queryText;
    query.createdAt = moment.utc();

    query.save(function () {

    });
}

router.get('/history', function (req, res) {
    var userId = req.token;
    Query.find({ 'userId': userId }, function (error, queries) {
        res.json({ status: 'ok', queries: queries.reverse() });
    });
});

router.post('/', function (req, res) {
    if (!req.body.query) {
        res.json({ status: 'error', erorrMessage: 'query field missing' });
        return;
    }
    
    if (!req.body.databaseId) {
        res.json({ status: 'error', erorrMessage: 'databaseId field missing' });
        return;
    }
    
    var dbId = req.body.databaseId;
    var query = req.body.query;
    
    saveQuery(query, req.token);

    DB.findOne({ '_id': dbId, 'userId': req.token }, function (error, db) {
        if (error) {
            res.json({ status: 'error', errorMessage: 'Failed fetching db' });
            return;
        }
        
        performQuery(db, query, function (result) {
            res.json(result);
        });    
    });
});

function performQuery(db, query, callback) {
    var sql = require('mssql');
    
    var config = {
        user: db.admin,
        password: db.password,
        server: db.server,
        database: db.name,
        
        options: {
            encrypt: true 
        }
    }
    
    sql.connect(config).then(function () {
        // Query        
        var request = new sql.Request();        
        var stopwatch = new Stopwatch();
        stopwatch.start();

        request.query(query).then(function (recordset) {
                stopwatch.stop();
                callback(({ status: 'ok', timeInMS: stopwatch.ms, recordset: { columns: recordset.columns, rows: recordset }}));
        }).catch(function (err) {
                stopwatch.stop();
                callback(({ status: 'error', errorMessage: err.message }));
            });
    }).catch(function (err) {
        stopwatch.stop();
        callback(({ status: 'error', errorMessage: 'Connection Error' }));
    });           
}

module.exports = router;