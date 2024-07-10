const mongoose = require('mongoose');

const serviceRecordsSchema = new mongoose.Schema({
    timeStartService: {
        type: Date,
        required: true,
    },
    timeEndService: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ['Processing', 'Processed', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Processing',
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    cage: { type: mongoose.Schema.Types.ObjectId, ref: 'Cage', default: null },
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

const _ServiceRecords = mongoose.model('ServiceRecords', serviceRecordsSchema);
module.exports = _ServiceRecords;
