var mongoose = require('mongoose');

module.exports = mongoose.model('Mess', {
    content: {
        type: String,
        default: "Contenu du message"
    },
    login: {
        type: String,
        default: 'login'
    },
    conv: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    hidden: {
        type: Boolean,
        default: false
    }
});
