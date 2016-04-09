var mongoose = require('mongoose');

var querySchema = mongoose.Schema({
    userId: String,
    text: String,
    createdAt: String
});

module.exports = mongoose.model('Query', querySchema);