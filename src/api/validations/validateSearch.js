const validateSearch = (req, res, next) => {
    const { name } = req.query;

    if (!name) {
        return res
            .status(400)
            .json({ status: 'error', message: 'Bad Request', data: { field: 'name', error: 'name is require' } });
    }

    next();
};

export default validateSearch;
