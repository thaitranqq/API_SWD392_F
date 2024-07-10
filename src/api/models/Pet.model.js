const mongoose = require('mongoose');
import _Image from './Image.model';

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    species: {
        type: String,
        require: true,
    },

    sex: {
        type: String,
        require: true,
    },
    breed: {
        type: String,
        require: true,
    },
    age: {
        type: Number,
        require: true,
    },
    serviceStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    image: {
        type: _Image.schema,
        require: true,
    },
    weight: {
        type: Number,
        require: true,
    },
    serviceRecords: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRecords' }],
        default: [],
    },
});

const _Pet = mongoose.model('Pet', petSchema);
module.exports = _Pet;
