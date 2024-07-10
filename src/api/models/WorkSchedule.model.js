const mongoose = require('mongoose');

const WorlScheduleSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Processing', 'Processed', 'Completed'],
        default: 'Processing',
    },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const _WorkSchedule = mongoose.model('WorkSchedule', WorlScheduleSchema );
module.exports = _WorkSchedule;
