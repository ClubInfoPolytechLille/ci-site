var mongoose = require('mongoose');

module.exports = mongoose.model('Ninfo', {
    login: {
        type: String,
        default: 'login'
    },
    equipe: {
        type: String,
        default: 'nope'
    },
    comment: {
        type: String,
        default: ''
    }
});
