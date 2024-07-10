import serviceRecordService from '../services/serviceRecordService';

const createServiceRecord = async (req, res) => {
    try {
        let data = await serviceRecordService.createServiceRecord(req.body);
        return res.status(200).json({
            status: data.status,
            message: data.message,
            data: data.data,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'error from server',
            data: '',
        });
    }
};
const cancelServiceRecord = async (req, res) => {
    try {
        let data = await serviceRecordService.cancelServiceRecord(req.body);
        return res.status(200).json({
            status: data.status,
            message: data.message,
            data: data.data,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'error from server',
            data: '',
        });
    }
};
const confirmServiceRecord = async (req, res) => {
    try {
        let data = await serviceRecordService.confirmServiceRecord(req.body);
        return res.status(200).json({
            status: data.status,
            message: data.message,
            data: data.data,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'error from server',
            data: '',
        });
    }
};

module.exports = {
    createServiceRecord,
    cancelServiceRecord,
    confirmServiceRecord,
};
