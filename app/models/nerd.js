// app/models/nerd.js
// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Nerd', {
    login: {
        type: String,
        default: 'login'
    },
    section: {
        type: String,
        default: 'IMA'
    },
    promo: {
        type: Number,
        default: 2017
    },
    role: {
        type: String,
        default: 'Membre'
    }
});