var express = require('express');
var router = express.Router();
var DB = require('../schemas/database.js');

router.get('/', function (req, res) {
    var userId = req.token;
    DB.find({ 'userId': userId }, function (error, dbs) {
        res.json({ status: 'ok', databases: dbs });
    });
});

router.get('/:id', function (req, res) {
    var userId = req.token;
    var id = req.params.id;

    DB.findOne({ 'userId': userId, '_id': id }, function (error, db) {
        res.json({ status: 'ok', database: db });
    });
});

router.delete('/:id/:name/tables', function (req, res) {
    var userId = req.token;
    var id = req.params.id;
    var tableName = req.params.name;

    DB.findById(id, function (error, db) {
        if (!db) {
            res.json({ status: 'error', errorMessage: 'A database with id ' + id + ' doesnt exist' });
            return;
        }
        else {
            for (var t in db.tables) {
                var table = db.tables[t];
                if (table.name === tableName) {
                    var index = db.tables.indexOf(table);
                    db.tables.splice(index, 1);

                    db.save(function (error, db) {
                        if (!error)
                            res.json({ status: 'ok' });
                        else
                            res.json({ status: 'error', errorMessage: 'Failed removing table' });
                    });

                    return;
                }
            }
            
            res.json({ status: 'error', errorMessage: 'Table ' + tableName + ' doesnt exist' });  
        }
    });
})

router.get('/:id/tables', function (req, res) {
    var userId = req.token;
    var id = req.params.id;
    
    DB.findById(id, function (error, db) {
        if (!db) {
            res.json({ status: 'error', errorMessage: 'A database with id ' + id + ' doesnt exist' });
            return;
        }
        else {
            var query = "SELECT TableName = c.table_name, ColumnName = c.column_name, DataType = data_type FROM information_schema.columns c INNER JOIN information_schema.tables t ON c.table_name = t.table_name AND t.table_type = 'BASE TABLE' ORDER BY TableName,ordinal_position";
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
                
                request.query(query).then(function (recordset) {
                    res.json({ status: 'ok', tables: recordset });
                }).catch(function (err) {
                    res.json({ status: 'error', errorMessage: 'Connection Error' });
                });
            }).catch(function (err) {
                res.json({ status: 'error', errorMessage: 'Connection Error' });
            });         
        }
    });
});

router.post('/:id/tables', function (req, res) {
    var userId = req.token;
    var id = req.params.id;

    DB.findById(id, function (error, db) {
        if (!db) {
            res.json({ status: 'error', errorMessage: 'A database with id ' + id + ' doesnt exist' });
            return;
        }
        else {
            db.tables.push(req.body);
            db.save(function (error, db) {
                if (!error)
                    res.json({ status: 'ok' });
                else
                    res.json({ status: 'error', errorMessage: 'Failed adding table' });
            });
        }
    });
});

router.post('/', function (req, res) {
    var userId = req.token;
    
    DB.findOne({ 'name': req.body.name }, function (error, existingDB) {
        if (existingDB) {
            res.json({ status: 'error', errorMessage: 'A database with that name already exists' });
            return;
        }
        else {
            var db = new DB();
            db.userId = userId;
            db.name = req.body.name;
            db.server = req.body.server;
            db.admin = req.body.admin;
            db.password = req.body.password;
            
            if (req.body.tables && req.body.tables.length > 0) {
                db.tables = req.body.tables;
            }
            
            db.save(function (error, model) {
                if (!error)
                    res.json({ status: 'ok' });
                else
                    res.json({ status: 'error', errorMessage: 'Failed creating database' });
            });
        }
    });   
});

router.delete('/:id', function (req, res) {
    var userId = req.token;
    var id = req.params.id;

    DB.findOneAndRemove({ 'userId': userId, '_id': id }, function (error, db) {
        res.json({ status: 'ok' });
    });
});

module.exports = router;