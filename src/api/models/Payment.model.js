const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    datePayment: {
        type: Date,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
});

const _Payment = mongoose.model('Payment', paymentSchema);
module.exports = _Payment;
