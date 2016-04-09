var mongoose = require('mongoose');

var databaseSchema = mongoose.Schema({
    userId: String,
    name: String,
    server: String,
    admin: String,
    password: String,
    tables: [
        {
            name: String,
            columns: [
                {
                    name: String,
                    type: String,
                    nullable: Boolean
                }
            ]
        }
    ]
});

module.exports = mongoose.model('DB', databaseSchema);