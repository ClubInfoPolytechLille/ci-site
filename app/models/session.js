var mongoose = require('mongoose');

module.exports = mongoose.model('Session', {
    login: { // On récupèrera le nom via les passwd
        type: String,
        default: 'login'
    },
    started: {
        type: Date,
        default: Date.now
    }
});
