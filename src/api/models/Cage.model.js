const mongoose = require('mongoose');

const cageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
        enum: ['Small', 'Medium', 'Large'],
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const _Cage = mongoose.model('Cage', cageSchema);
module.exports = _Cage;
