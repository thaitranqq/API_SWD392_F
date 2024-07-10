import orderService from '../services/orderService';

const createOrder = async (req, res) => {
    try {
        let data = await orderService.createOrder(req.body);
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
const cancelOrder = async (req, res) => {
    try {
        let data = await orderService.cancelOrder(req.body);
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
const confirmOrder = async (req, res) => {
    try {
        let data = await orderService.confirmOrder(req.body);
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
const getOrder = async (req, res) => {
    try {
        let data = await orderService.getOrder(req.query);
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
const getOrderHistory = async (req, res) => {
    try {
        let data = await orderService.getOrderHistory(req.query);
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
    createOrder,
    cancelOrder,
    confirmOrder,
    getOrder,
    getOrderHistory,
};
