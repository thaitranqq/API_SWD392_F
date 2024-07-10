const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
});

const _Image = mongoose.model('Image', imageSchema);
module.exports = _Image;
