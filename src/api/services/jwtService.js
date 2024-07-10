import jwt, { decode } from 'jsonwebtoken';
require('dotenv').config();
const createAccessToken = (data) => {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_KEY, { expiresIn: '15m' });
    return token;
};
const createRefreshToken = (data) => {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_KEY, { expiresIn: '90d' });
    return token;
};
function extractToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}
const verifyToken = (token) => {
    let decoded = null;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    } catch (err) {
        console.log(err);
    }
    return decoded;
};
const verifyFreshToken = (token) => {
    let decoded = null;
    try {
        decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    } catch (err) {
        console.log(err);
    }
    return decoded;
};
const refreshToken = (token) => {
    try {
        if (!token) {
            return { status: 'error', message: 'refreshToken can not null', data: '' };
        }
        const decoded = verifyFreshToken(token);
        if (!decoded) {
            return { status: 'error', message: 'refreshToken was wrong or expired', data: '' };
        }
        const { email, role } = decoded;
        const payload = { email, role };
        const accessToken = createAccessToken(payload);
        const frToken = createRefreshToken(payload);
        return {
            status: 'success',
            message: 'Refresh Token success !',
            data: {
                access_token: accessToken,
                refresh_token: frToken,
            },
        };
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    extractToken,
    verifyToken,
    refreshToken,
};
