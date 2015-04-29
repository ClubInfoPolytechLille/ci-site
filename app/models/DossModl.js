var mongoose = require('mongoose');

module.exports = mongoose.model('Doss', {
    titre: {
        type: String,
        default: "Dossier"
    },
    parent: {
        type: String,
        default: 'lost'
    },
    special: {
        type: String,
        default: ''
    },
    hidden: {
        type: Boolean,
        default: false
    }
});
