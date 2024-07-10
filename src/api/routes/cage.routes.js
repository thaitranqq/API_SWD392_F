import express from 'express';
import cageController from '../controllers/cageController';
import { checkUserAuth, checkPermissionUser } from '../middlewares/jwtMiddleWares';
const router = express.Router();

router.post('/cage/empty', checkUserAuth, checkPermissionUser(['STAFF']), cageController.getEmptyCage);

export default router;
