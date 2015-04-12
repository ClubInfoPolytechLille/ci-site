var mongoose = require('mongoose');

module.exports = mongoose.model('PolyUser', {
    login: {
        type: String,
        default: 'login'
    },
    nom: {
        type: String,
        default: 'Nom'
    },
    section: {
        type: String,
        default: ''
    }
});
