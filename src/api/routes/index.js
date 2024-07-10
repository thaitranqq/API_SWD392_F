import express from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import petRoutes from './pet.routes';
import serviceRoutes from './service.routes';
import cageRoutes from './cage.routes';

const router = express.Router();

const apiRoutes = (app) => {
    router.use(userRoutes);
    router.use(authRoutes);
    router.use(productRoutes);
    router.use(orderRoutes);
    router.use(petRoutes);
    router.use(serviceRoutes);
    router.use(cageRoutes);

    app.use('/api/v1', router);
    app.use((req, res, next) => {
        res.status(404).json({ status: 'error', message: 'Not Found', data: '' });
    });
    return app;
};

export default apiRoutes;
