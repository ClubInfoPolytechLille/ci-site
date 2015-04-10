var mongoose = require('mongoose');

module.exports = mongoose.model('Conv', {
    titre: {
        type: String,
        default: "Conversation"
    }
    // TODO Visibilité (brouillon)
    // TODO Répertoire
});
