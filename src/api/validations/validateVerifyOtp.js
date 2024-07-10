const validateVerifyOtp = (req, res, next) => {
    const { name, dob, email, phone, password, sex, otp } = req.body;

    if (!name) {
        return res
            .status(400)
            .json({ status: 'error', message: 'Bad Request', data: { field: 'name', error: 'name is require' } });
    }
    if (!dob) {
        return res
            .status(400)
            .json({ status: 'error', message: 'Bad Request', data: { field: 'dob', error: 'dob is require' } });
    }
    if (!email) {
        return res
            .status(400)
            .json({ status: 'error', message: 'Bad Request', data: { field: 'email', error: 'email is require' } });
    }
    if (!phone) {
        return res
            .status(400)
            .json({ status: 'error', message: 'Bad Request', data: { field: 'phone', error: 'phone is require' } });
    }
    if (!password) {
        return res.status(400).json({
            status: 'error',
            message: 'Bad Request',
            data: { field: 'password', error: 'password is require' },
        });
    }
    if (!sex) {
        return res
            .status(400)
            .json({ status: 'error', message: 'Bad Request', data: { field: 'sex', error: 'sex is require' } });
    }
    if (!otp) {
        return res
            .status(400)
            .json({ status: 'error', message: 'Bad Request', data: { field: 'otp', error: 'otp is require' } });
    }

    next();
};

export default validateVerifyOtp;
