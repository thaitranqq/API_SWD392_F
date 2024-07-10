import express from 'express';
import { checkUserAuth, checkPermissionUser } from '../middlewares/jwtMiddleWares';
import orderController from '../controllers/orderController';
import { checkQuantityOrder } from '../middlewares/orderMiddleWares';
import { validateCreateOrder } from '../validations/validateOrder';

const router = express.Router();

router.post(
    '/orders',
    checkUserAuth,
    checkPermissionUser(['CUSTOMER']),
    validateCreateOrder,
    checkQuantityOrder,
    orderController.createOrder,
);
router.post('/orders/cancel', checkUserAuth, checkPermissionUser(['CUSTOMER', 'STAFF']), orderController.cancelOrder);
router.post('/orders/confirm', checkUserAuth, checkPermissionUser(['STAFF']), orderController.confirmOrder);
router.get('/orders', checkUserAuth, checkPermissionUser(['STAFF']), orderController.getOrder);
router.get('/orders/history', checkUserAuth, checkPermissionUser(['CUSTOMER']), orderController.getOrderHistory);

export default router;
