const validateViewProductsAndSort = (req, res, next) => {
    const { type, sort } = req.query;

    if (!type) {
        return res
            .status(400)
            .json({ status: 'error', message: 'Bad Request', data: { field: 'type', error: 'type is require' } });
    }

    if (!sort) {
        return res.status(400).json({
            status: 'error',
            message: 'Bad Request',
            data: { field: 'sort', error: 'sort is require' },
        });
    }

    next();
};

export default validateViewProductsAndSort;
