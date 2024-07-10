const mongoose = require('mongoose');
const orderDetailSchema = new mongoose.Schema({
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
});

const _OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);
module.exports = _OrderDetail;
