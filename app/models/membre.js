var mongoose = require('mongoose');

module.exports = mongoose.model('Membre', {
    login: { // On récupèrera le nom via les passwd
        type: String,
        default: 'login'
    },
    section: {
        type: String,
        default: 'IMA'
    },
    promo: { // Nécessaire pour calculer le numéro de section
        type: Number,
        default: 2017
    },
    role: {
        type: String,
        default: 'Membre'
    }
});
