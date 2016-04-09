var env = require('./env.json');

exports.config = function () {
    var node_env = env['environment'];
    return env[node_env];
};