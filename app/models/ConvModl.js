var mongoose = require('mongoose');

module.exports = mongoose.model('Conv', {
    titre: {
        type: String,
        default: "Conversation"
    },
    parent: {
        type: String,
        default: 'lost'
    }
    // TODO Visibilité (brouillon)
    // TODO Répertoire
});
