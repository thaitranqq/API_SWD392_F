import express from 'express';
import authController from '../controllers/authController';
import validateRegister from '../validations/validateRegister';
import validateVerifyOtp from '../validations/validateVerifyOtp';
import validateLogin from '../validations/validateLogin';
import validateRefreshToken from '../validations/validateRefreshToken';
const router = express.Router();

router.post('/auth/register', validateRegister, authController.register);
router.post('/auth/verifyOtp', validateVerifyOtp, authController.verifyOtp);
router.post('/auth/login', validateLogin, authController.login);
router.post('/auth/refreshToken', validateRefreshToken, authController.refreshToken);

export default router;
