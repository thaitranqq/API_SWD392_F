import petService from '../services/petService';

const createPet = async (req, res) => {
    try {
        let data = await petService.createPet(req);
        return res.status(200).json({
            status: data.status,
            message: data.message,
            data: data.data,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'error from server',
            data: '',
        });
    }
};
const viewPet = async (req, res) => {
    try {
        let data = await petService.viewPet(req.query);
        return res.status(200).json({
            status: data.status,
            message: data.message,
            data: data.data,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'error from server',
            data: '',
        });
    }
};
const deletePet = async (req, res) => {
    try {
        let data = await petService.deletePet(req.query);
        return res.status(200).json({
            status: data.status,
            message: data.message,
            data: data.data,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'error from server',
            data: '',
        });
    }
};

module.exports = {
    createPet,
    viewPet,
    deletePet,
};
