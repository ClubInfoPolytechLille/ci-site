var mongoose = require('mongoose');

module.exports = mongoose.model('Membre', {
    login: { // On récupèrera le nom via les passwd
        type: String,
        default: 'login'
    },
    role: {
        type: String,
        default: 'Membre'
    },
    hidden: {
        type: Boolean,
        default: false
    }
});
