var mongoose = require('mongoose');

module.exports = mongoose.model('Conv', {
    titre: {
        type: String,
        default: "Conversation"
    },
    started: {
        type: Date,
        default: Date.now
    }
});
