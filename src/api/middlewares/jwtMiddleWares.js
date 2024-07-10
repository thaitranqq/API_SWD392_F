require('dotenv').config();
import { extractToken, verifyToken } from '../services/jwtService';
const checkPermissionUser = (permission) => {
    try {
        return (req, res, next) => {
            const role = req.role;
            if (!role) {
                return res.status(401).json({
                    status: 'error',
                    message: 'unAuthorization',
                    data: '',
                });
            }
            const checkPermission = permission.some((p) => p == role);
            if (!checkPermission) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Your role can not accessed',
                    data: '',
                });
            }
            return next();
        };
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            status: 'error',
            message: 'Your role can not accessed',
            data: '',
        });
    }
};
const checkUserAuth = (req, res, next) => {
    try {
        const token = extractToken(req);
        if (token) {
            const decode = verifyToken(token);
            if (!decode) {
                return res.status(401).json({
                    status: 'error',
                    message: 'jwt expired',
                    data: '',
                });
            }
            req.role = decode.role;
            return next();
        }
        return res.status(401).json({
            status: 'error',
            message: 'unAuthorization',
            data: '',
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: 'error',
            message: 'unAuthorization',
            data: '',
        });
    }
};

module.exports = {
    checkUserAuth,
    checkPermissionUser,
};
