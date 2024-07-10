const mongoose = require('mongoose');

const Medical_Examination_HistorySchema = new mongoose.Schema({
    visit_Date: {
        type: Date,
        required: true,
    },
    symptoms: {
        type: String,
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const _Medical_Examination_History = mongoose.model('Medical_Examination_History', Medical_Examination_HistorySchema);
module.exports = _Medical_Examination_History;
