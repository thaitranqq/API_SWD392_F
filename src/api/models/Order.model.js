const mongoose = require('mongoose');
import _Shipping from './Shipping.model';
import _Payment from './Payment.model';
import _OrderDetail from './OrderDetail.model';

const orderSchema = new mongoose.Schema({
    dateOrder: {
        type: Date,
        default: Date.now(),
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Processing', 'In Transit', 'Cancelled', 'Completed'],
        default: 'Processing',
    },
    shipping: {
        type: _Shipping.schema,
        required: true,
    },
    payment: {
        type: _Payment.schema,
        required: true,
    },
    orderDetails: {
        type: [_OrderDetail.schema],
        default: [],
        required: true,
    },
    cancellation: {
        type: new mongoose.Schema({
            date: {
                type: Date,
                required: true,
            },
            reason: {
                type: String,
                required: true,
            },
        }),
        default: null,
    },
});

const _Order = mongoose.model('Order', orderSchema);
module.exports = _Order;
