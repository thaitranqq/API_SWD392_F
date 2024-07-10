const _Product = require('../models/Product.model');

const checkQuantityOrder = async (req, res, next) => {
    try {
        const { cartDetails } = req.body;
        for (let item of cartDetails) {
            let product = await _Product.findOne({ _id: item.productId });
            if (product.quantity < item.quantity) {
                return res.status(200).json({
                    status: 'error',
                    message: `${product.name} không đủ số lượng để cung cấp cho bạn, số lượng hiện có: ${product.quantity}`,
                    data: '',
                });
            }
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: 'error',
            message: 'error checkQuantityOrder',
            data: '',
        });
    }
};

module.exports = {
    checkQuantityOrder,
};
