const validateViewProducts = (req, res, next) => {
    const { type } = req.query;

    if (!type) {
        return res
            .status(400)
            .json({ status: 'error', message: 'Bad Request', data: { field: 'type', error: 'type is require' } });
    }

    next();
};

export default validateViewProducts;
