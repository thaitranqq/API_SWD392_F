import express from 'express';
import { checkUserAuth, checkPermissionUser } from '../middlewares/jwtMiddleWares';
import userController from '../controllers/userController';

const router = express.Router();

router.get('/user/:id', checkUserAuth, checkPermissionUser(['CUSTOMER', 'STAFF', 'ADMIN']), userController.getUserById);

export default router;
