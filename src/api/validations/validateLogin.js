const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return res
            .status(400)
            .json({ status: 'error', message: 'Bad Request', data: { field: 'email', error: 'email is require' } });
    }

    if (!password) {
        return res.status(400).json({
            status: 'error',
            message: 'Bad Request',
            data: { field: 'password', error: 'password is require' },
        });
    }

    next();
};

export default validateLogin;
