import express from 'express';
import petController from '../controllers/petController';
import upload from '../../config/multer';
import { checkUserAuth, checkPermissionUser } from '../middlewares/jwtMiddleWares';
const router = express.Router();

router.post('/pet', checkUserAuth, checkPermissionUser(['CUSTOMER']), upload.single('file'), petController.createPet);
router.get('/pet', checkUserAuth, checkPermissionUser(['CUSTOMER']), petController.viewPet);
router.delete('/pet', checkUserAuth, checkPermissionUser(['CUSTOMER']), petController.deletePet);

export default router;
