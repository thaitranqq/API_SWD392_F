import express from 'express';
import { checkUserAuth, checkPermissionUser } from '../middlewares/jwtMiddleWares';
import serviceRecordController from '../controllers/serviceRecordController';

const router = express.Router();

router.post('/service', checkUserAuth, checkPermissionUser(['CUSTOMER']), serviceRecordController.createServiceRecord);
router.post(
    '/service/confirm',
    checkUserAuth,
    checkPermissionUser(['STAFF']),
    serviceRecordController.confirmServiceRecord,
);
router.post(
    '/service/cancel',
    checkUserAuth,
    checkPermissionUser(['CUSTOMER,"STAFF']),
    serviceRecordController.cancelServiceRecord,
);

export default router;
