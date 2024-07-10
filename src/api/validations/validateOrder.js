const { check, validationResult } = require('express-validator');

const validateCreateOrder = [
    check('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('userId must be a valid MongoId'),
    check('paymentMethod')
        .notEmpty()
        .withMessage('paymentMethod is required')
        .isString()
        .withMessage('paymentMethod must be a string'),
    check('cartDetails').isArray({ min: 1 }).withMessage('cartDetails must be a non-empty array'),
    check('cartDetails.*.productId')
        .notEmpty()
        .withMessage('productId is required')
        .isMongoId()
        .withMessage('productId must be a valid MongoId'),
    check('cartDetails.*.quantity')
        .notEmpty()
        .withMessage('quantity is required')
        .isInt({ min: 1 })
        .withMessage('quantity must be an integer greater than 0'),
    check('addressShipping')
        .notEmpty()
        .withMessage('addressShipping is required')
        .isObject()
        .withMessage('addressShipping must be an object'),
    check('addressShipping.street')
        .notEmpty()
        .withMessage('street is required')
        .isString()
        .withMessage('street must be a string'),
    check('addressShipping.district')
        .notEmpty()
        .withMessage('district is required')
        .isString()
        .withMessage('district must be a string'),
    check('addressShipping.city')
        .notEmpty()
        .withMessage('city is required')
        .isString()
        .withMessage('city must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Bad Request',
                data: errors.array().map((err) => ({
                    field: err.param,
                    error: err.msg,
                })),
            });
        }
        next();
    },
];

module.exports = {
    validateCreateOrder,
};
