const mongoose = require('mongoose');
import _Address from './Address.model';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    dob: {
        type: Date,
        require: true,
    },
    address: {
        type: _Address.schema,
        default: null,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    phone: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        default: 'CUSTOMER',
    },
    isDisabled: {
        type: Boolean,
        default: false,
    },
    sex: {
        type: String,
        require: true,
    },
    isWorking: {
        type: Boolean,
        default: false,
    },
    orders: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
        default: [],
    },
    pets: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
        default: [],
    },
});

const _User = mongoose.model('User', userSchema);
module.exports = _User;
