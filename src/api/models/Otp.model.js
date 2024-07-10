const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    time: { type: Date, default: Date.now(), index: { expires: 20 } },
});

const _Otp = mongoose.model('Otp', otpSchema);
module.exports = _Otp;
