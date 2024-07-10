import _User from '../models/User.model';

const getUserById = async (data) => {
    try {
        const { id } = data;
        const user = await _User.findOne({ _id: id });
        if (user) {
            return {
                status: 'success',
                message: 'Get user detail success !',
                data: user,
            };
        }
        return {
            status: 'error',
            message: 'can not get user detail !',
            data: '',
        };
    } catch (error) {
        console.log(error);
        return {
            status: 'error',
            message: 'something was wrong in service',
            data: '',
        };
    }
};

module.exports = {
    getUserById,
};
