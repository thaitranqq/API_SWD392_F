import authService from '../services/authService';
import jwtService from '../services/jwtService';

const register = async (req, res) => {
    try {
        let data = await authService.createUser(req.body);
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
const verifyOtp = async (req, res) => {
    try {
        let data = await authService.verifyOtp(req.body);
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
const login = async (req, res) => {
    try {
        let data = await authService.loginUser(req.body);
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
const refreshToken = async (req, res) => {
    try {
        let data = await jwtService.refreshToken(req.body.refreshToken);
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
    register,
    verifyOtp,
    login,
    refreshToken,
};
