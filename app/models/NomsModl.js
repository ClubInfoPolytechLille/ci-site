var mongoose = require('mongoose');

module.exports = mongoose.model('Noms', {
    login: { // On récupèrera le nom via les passwd
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
