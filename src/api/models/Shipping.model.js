const mongoose = require('mongoose');
import _Address from './Address.model';
const shippingSchema = new mongoose.Schema({
    shippingFee: {
        type: Number,
        default: 12000,
    },
    addressShipping: {
        type: _Address.schema,
        required: true,
    },
});

const _Shipping = mongoose.model('Shipping', shippingSchema);
module.exports = _Shipping;
