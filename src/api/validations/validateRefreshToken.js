const validateRefreshToken = (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res
            .status(400)
            .json({
                status: 'error',
                message: 'Bad Request',
                data: { field: 'refreshToken', error: 'refreshToken is require' },
            });
    }

    next();
};

export default validateRefreshToken;
